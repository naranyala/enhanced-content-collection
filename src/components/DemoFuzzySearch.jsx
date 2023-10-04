import { onMount, createSignal, Switch, Match } from 'solid-js'
import { For } from 'solid-js'
import Fuse from 'fuse.js'

const FUSE_OPTIONS = {
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  minMatchCharLength: 1,
  threshold: 0.5,
  keys: [
    // { name: "data.title", weight: 1 },
    // { name: "data.context", weight: 1 },
    // { name: "data.tags", weight: 1 },
    { name: "text", weight: 1 },
    { name: "slug", weight: 1 },
    { name: "link", weight: 1 },
    // { name: "headings", weight: 2 },
    // { name: "headings.link", weight: 2 },
    // { name: "headings.children.link", weight: 2 },
    // { name: "headings.children.chidren.link", weight: 2 }
  ]
}

function makeContentFlat(headings) {
  const flattenedArray = [];

  function recursiveFlatten(currHeadings) {
    for (const heading of currHeadings) {
      flattenedArray.push({
        type: heading.type,
        text: heading.text,
        slug: heading.slug,
        link: heading.link,
      });

      if (heading.children && heading.children.length > 0) {
        recursiveFlatten(heading.children);
      }
    }
  }

  recursiveFlatten(headings);
  return flattenedArray;
}

function normalizeChildHeading(inputArr) {
  const finalContent = inputArr.map((item, index) => {
    if (item.type !== "h1") {
      const parentHeading = inputArr.slice(0, index).reverse().find(entry => entry.type === "h1");
      if (parentHeading) {
        return {
          ...item,
          text: `${parentHeading.text} - ${item.text}`,
          slug: `${parentHeading.slug}`
        };
      }
    }
    return item;
  });
  return finalContent;
}

export default function DemoFuzzySearch(props) {
  const [content, setContent] = createSignal(props.content)
  const [headings, setHeadings] = createSignal([])
  const [query, setQuery] = createSignal("")
  const [result, setResult] = createSignal([])

  let elInputQuery

  onMount(() => {
    elInputQuery.focus()
    const searchContent = content().map(item => item.headings);
    const flatContent = makeContentFlat([].concat(...searchContent))
    const finalContent = normalizeChildHeading(flatContent)
    setHeadings(finalContent)
    // console.log(headings())
  })

  const handleSearchAction = (e) => {
    setQuery(e.target.value)
    // console.log(query())
    // console.log(`content:`, content())
    console.log(`headings:`, headings())

    const fuse = new Fuse(headings(), FUSE_OPTIONS)
    const searchResult = fuse.search(query());
    setResult(searchResult)
    console.log(`result:`, result())
  }

  const actionResetResult = () => {
    setQuery("")
    setResult([])
  }

  return (
    <div class="m-4 p-4">
      <div class="flex justify-between flex-col">
        <span class="text-xl text-center mx-auto font-bold">
          Navigate between content headings<br />(even without a network connection)
        </span>
      </div>

      <div class="relative flex-grow text-center my-4">
        <input
          ref={elInputQuery}
          id="search-query"
          onKeyUp={handleSearchAction}
          placeholder="Search"
          value={query()}
          type="text" class="w-full px-4 py-2 border rounded-lg" />
        <button onClick={actionResetResult} class="absolute inset-y-0 right-0 px-4 py-auto m-1 bg-white/0 text-gray-700 hover:text-gray-900 content-center align-center rounded-r-lg font-bold">Reset</button>
      </div>

      <ul class="space-y-1 overflow-x-auto">
        <Switch>
          <Match when={!query().length}>
            <For each={headings()}>
              {(head, idx) => (
                <li key={idx} class="my-1 h-min">
                  <a
                    href={head.link}
                    class="flex justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
                  >{head.text}
                  </a>
                </li>
              )}
            </For>
          </Match>

          <Match when={query().length && result().length < 1}>
            <div>
              <h1 class="text-center text-xl font-bold">Not Found</h1>
            </div>
          </Match>

          <Match when={query().length && headings().length > 1}>
            <For each={result()}>
              {(content, idx) => (
                <li key={idx} class="my-1 h-min">
                  <a
                    href={content.item.link}
                    class="flex justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
                  >{content.item.text}
                  </a>
                </li>
              )}
            </For>
          </Match>

        </Switch>
      </ul>
    </div>
  )
};


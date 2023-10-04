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
    {name: "headings", weight: 2},
    { name: "data.title", weight: 1 },
    { name: "data.context", weight: 1 },
    { name: "data.tags", weight: 1 },
  ]
}


function makeContentFlat(headings) {
    const flattenedArray = [];
  
    function recursiveFlatten(currentHeadings) {
      for (const heading of currentHeadings) {
        flattenedArray.push({
          type: heading.type,
          text: heading.text,
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

function makeFinalContent(inputArray){
  const updatedArray = inputArray.map((item, index) => {
    if (item.type !== "h1") {
        const parentHeading = inputArray.slice(0, index).reverse().find(entry => entry.type === "h1");
        if (parentHeading) {
            return {
                ...item,
                text: `${parentHeading.text} - ${item.text}`
            };
        }
    }
    return item;
});
return updatedArray;
}

export default function DemoFuzzySearch(props) {
  const [content, setContent] = createSignal(props.content)
  const [headings, setHeadings] = createSignal([])
  const [query, setQuery] = createSignal("")
  const [result, setResult] = createSignal([])

  const [matchTotal, setMatchTotal] = createSignal(0)

  let elInputQuery

  onMount(() => {
    // elInputQuery.focus()
    //console.log(JSON.stringify(content(), null, 2))
    const searchContent = content().map(item => {
      return item.headings;
    });
    
    const flatContent = makeContentFlat([].concat(...searchContent))
    const finalContent = makeFinalContent(flatContent)
    setHeadings(finalContent)
    //console.log(JSON.stringify(flatContent, null, 2))
    console.log(headings())
    
   /*
   console.log(JSON.stringify(searchContent, null, 2));
    setHeadings(searchContent)
    */
  })

  const handleSearchAction = (e) => {
    setQuery(e.target.value)

    const fuse = new Fuse(content(), FUSE_OPTIONS)
    const searchResult = fuse.search(query());
    setResult(searchResult)

    setMatchTotal(searchResult.length)
  }

  const actionResetResult = () => {
    setQuery("")
    setResult([])
  }

  return (
   <div class="m-4 p-4">
          <div class="flex justify-between flex-col">
            <span class="text-xl text-center mx-auto font-bold">Jump between content headings<br/> (without network connection)</span>
          

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
              <Match when={headings().length}>
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

              <Match when={content().length && result().length < 1}>
                <div>
                  <h1 class="text-center text-xl font-bold">Not Found</h1>
                </div>
              </Match>

              <Match when={result().length}>
                <For each={result()}>
                  {(content, idx) => (
                    <li class="my-1 h-min">
                      <a
                        href={content.item.slug}
                        class="flex justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
                      >{content.item.data.title}
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

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
    { name: "body", weight: 2 },
    { name: "data.title", weight: 1 },
    { name: "data.context", weight: 1 },
    { name: "data.tags", weight: 1 },
  ]
}


export default function DemoFuzzySearch(props) {
  const [content, setContent] = createSignal(props.content)
  const [query, setQuery] = createSignal("")
  const [result, setResult] = createSignal([])

  const [matchTotal, setMatchTotal] = createSignal(0)

  let elInputQuery

  onMount(() => {
    elSearch.focus()
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

  const handleKeyDown = (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      console.log("Escape key pressed!");
    }
  }

  return (
   <div>
          <div class="flex justify-between flex-col">
            <span class="text-xl text-center mx-auto font-bold">All Essay Search</span>
            <div class="flex flex-col items-center text-center w-full text-xl">
              <span>Total match <b class="font-bold">{matchTotal()}</b></span>
            </div>

          </div>

          <div class="relative flex-grow text-center">
            <input
              ref={elInputQuery}
              id="search-query"
              onKeyUp={handleSearchAction}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              value={query()}
              type="text" class="w-full px-4 py-2 border rounded-lg" />
            <button onClick={actionResetResult} class="absolute inset-y-0 right-0 px-4 py-auto m-1 bg-white/0 text-gray-700 hover:text-gray-900 content-center align-center rounded-r-lg font-bold">Reset</button>
          </div>


          <ul class="space-y-1 overflow-x-auto">
            <Switch>
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
                        href={`/essays/${content.item.slug}`}
                        class="flex justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
                      >
                        <h1 class="flex-1 text-lg text-left font-bold items-start">{content.item.data.title}</h1>
                        <small class="flex-1 text-right right-0 items-end">{content.item.data.context}</small>
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

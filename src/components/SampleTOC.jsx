
import { createSignal, For, Switch, Match, onMount } from 'solid-js'

export default function SampleToc(props) {
  const [heading, setHeading] = createSignal([])

  onMount(() => {
    console.log(props.headings)
    setHeading(props.headings)
  })

  return (
    <div class="m-4 p-4 rounded-lg bg-white/80">
      <ul class="text-left ml-4 border-l-4 border-gray-300">

      <For each={heading()}>
        {(headLevel1, idx1) => (
            <>
          <a key={idx1} href={headLevel1.link} class="p-0 m-0">
                          <li class="hover:bg-gray-300 w-max pl-2 py-1 m-0">
                            {headLevel1.text}
                          </li>
                        </a>
            <Switch>
                <Match when={headLevel1.children}>
                  <ul class="ml-6 border-l-4 border-gray-300">
                    <For each={headLevel1.children}>
                      {(headLevel2, idx2) => (
                        <>
                        <a key={idx2} href={headLevel2.link} class="p-0 m-0">
                          <li class="hover:bg-gray-300 w-max pl-2 py-1 m-0">
                            {headLevel2.text}
                          </li>
                        </a>
            <Switch>
                <Match when={headLevel2.children}>
                  <ul class="ml-6 border-l-4 border-gray-300">
                    <For each={headLevel2.children}>
                      {(headLevel3, idx3) => (
                        <a key={idx3} href={headLevel3.link} class="p-0 m-0">
                          <li class="hover:bg-gray-300 w-max pl-2 py-1 m-0">
                            {headLevel3.text}
                          </li>
                        </a>
                      )}
                    </For>
                  </ul>
                </Match>
            </Switch>
</>
                      )}
                    </For>
                  </ul>
                </Match>
            </Switch>
          </>
        )}
      </For>
          </ul>
    </div>
  )
}

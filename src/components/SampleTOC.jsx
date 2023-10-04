
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
          <li key={idx1} class="hover:bg-gray-300 m-1 p-1 rounded w-max">
              <a href={headLevel1.link}>{headLevel1.text}</a>
          </li>
            <Switch>
                <Match when={headLevel1.children}>
                  <ul class="ml-6 border-l-4 border-gray-300">
                    <For each={headLevel1.children}>
                      {(headLevel2, idx2) => (
                        <>
                        <li key={idx2} class="hover:bg-gray-300 m-1 p-1 rounded w-max">
                          <a href={headLevel2.link}>{headLevel2.text}</a>
                        </li>
            <Switch>
                <Match when={headLevel2.children}>
                  <ul class="ml-6 border-l-4 border-gray-300">
                    <For each={headLevel2.children}>
                      {(headLevel3, idx3) => (
                        <li key={idx3} class="hover:bg-gray-300 m-1 p-1 rounded w-max">
                          <a href={headLevel3.link}>{headLevel3.text}</a>
                        </li>
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

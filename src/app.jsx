import { Topbar } from './ui'
import { createClient, Provider } from '@urql/preact';
import { Manga } from './manga'

const client = createClient({
  url: 'https://graphql.anilist.co',
});

 

export function App({page,perpage}) {
  console.log(page)
  console.log(perpage)
  return (
    <>
      <Topbar />
      
      
        <Provider value={client}>
          <Manga page={page} perpage={perpage} />
        </Provider>
      
       </>
  )
}

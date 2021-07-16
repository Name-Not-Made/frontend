import { Topbar } from './ui'
import { createClient, Provider } from '@urql/preact';
import { Manga } from './manga'

const client = createClient({
  url: 'https://graphql.anilist.co',
});

 

export function Search({query, page,perpage}) {
  console.log(page)
  console.log(perpage)
  return (
    <>
      <Topbar />
      
      <h1 className="ml-16 mt-20 text-white text-2xl">You've searched for {query} </h1>
        <Provider value={client}>
          <Manga search={query} page={page} perpage={perpage} />
        </Provider>
      
       </>
  )
}
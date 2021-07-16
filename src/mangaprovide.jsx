import { createClient, Provider } from '@urql/preact';
import { Mangainfo } from './mangainfo'
import { Topbarb } from './ui'

const clienta = createClient({
  url: 'https://graphql.anilist.co',
});

 

export function Mangapro({mangaida}) {
  console.log({mangaida})
  return (
    <>
      <Topbarb />
        <Provider value={clienta}>
          <Mangainfo mangaid={mangaida} />
        </Provider>
    </>
  )
}
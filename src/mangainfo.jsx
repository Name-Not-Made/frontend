import { useQuery } from '@urql/preact'
import { Comment } from './comment'

export function Mangainfo(props) {
    const [{ fetching, data, error }] = useQuery({
        query: `
        query ($id: Int) {
            Media(id: $id, type: MANGA) {
              id
              title {
                romaji
                english
                native
              }
              description
              startDate {
                year
                month
                day
              }
              genres
              averageScore
              popularity
              endDate {
                year
                month
                day
              }
              status
              coverImage {
                extraLarge
              }
              chapters	
              reviews {
                edges {
                  node {
                    id
                  }
                }
              }
              staff {
                nodes {
                  id
                  name {
                    full
                  }
                }
              }
            }
          }
    `,
        variables: { id: Number(props.mangaid) },
requestPolicy: 'network-only'
    });
    
   console.log(props.mangaid)
if (fetching==false) { console.log(data.Media)

    return (
        <>
            <h1 class=" left-1/2 absolute top-1.5 inline-block text-center text-gray-50 w-64 -ml-32 font-bold">
                {data.Media.title.romaji}
        </h1>
            <div class="text-xs leading-4 text-center p-4 font-bold grid-cols-2">
                <img class=" mt-16 float-left w-1/3 inline" style="max-width: 240px;"
                    src={data.Media.coverImage.extraLarge} alt={data.Media.title.romaji} />
                <div class=" text-gray-50" style="min-width: 240px;margin-top: 10%;">
                    <h1 class=" text-xl">{data.Media.title.romaji}</h1>
                    <hr />
                    <div class=" h-auto leading-relaxed grid md:grid-cols-2">
                        <p class="  m-4 mb-0 text-sm ">{data.Media.description}</p>
                        <ul id="mangainfo" class="p-3 leading-loose bg-gray-700 float-right text-xs mt-2 m-4 block">
                            <li>Authur: {data.Media.staff.nodes.map(nodes => (
                            <>
                            {nodes.name.full}, 
                            </>
                            )
                            )}
                            </li>
                            <li>Genre: {data.Media.genres}</li>
                            <li>Rating: {data.Media.averageScore}</li>
                            <li>{data.Media.status}</li>
                            <li>Last updated on {data.Media.endDate.day}.{data.Media.endDate.month}.{data.Media.endDate.year}</li>
                            <li>Published on {data.Media.startDate.day}.{data.Media.startDate.month}.{data.Media.startDate.year}</li>
                            <li>{data.Media.popularity} views</li>
                        </ul>
                    </div>
                    <div class="  ">
                        <a class=" btn border-gray-300 border mt-4"><svg xmlns="http://www.w3.org/2000/svg"
                            class=" inline -mt-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg> Read</a>

                        <a class="btn ml-1 border-gray-300 border mt-4"><svg xmlns="http://www.w3.org/2000/svg"
                            class=" inline -mt-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg> Bookmark</a>
                        <a class=" ml-1 btn border-gray-300 border mt-4">Follow</a>
                        <a class=" ml-1 btn border-gray-300 border mt-4"><svg xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg> Report</a>
                    </div>
                    <h1 class="float-right right-0 relative mt-16 text-xl"> {data.Media.chapters} chapters</h1>
                </div>

            </div>
            <br />
               
                <div>

                    <h1 class="float-right font-bold text-white mr-4 mb-4 right-0 relative mt-16 text-xl"> 10 Comments</h1>

                    <ul class="w-full grid grid-flow-row mt-16">
                    { data.Media.reviews.edges.map(edges => (
                            <>
                            <Comment id={edges.node.id} />
                            </>
                            )
                            ) }
                    </ul>
                </div>
        </>
    )
}
}
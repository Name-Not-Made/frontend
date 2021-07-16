import { useQuery } from '@urql/preact'
import { Link } from 'preact-router'
import { Pagination } from './ui'


export function Manga(props) {

  const [{ fetching, data, error }] = useQuery({
    query: `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (id: $id, search: $search) {
                id
                title {
                  romaji
                }
                coverImage {
                    large
                }
                isAdult
              }
            }
          }
          
    `,
    variables: { search: props.search, page: Number(props.page), perPage: Number(props.perpage) }

  });
  if (fetching == false) {

    return (
      <>  <div class="my-16  text-gray-50 mx-4 gap-4 text-sm grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {data.Page.media.map(media => {
          if (!media.isAdult) {
            return (
              <div class="">
                <Link href={"/manga/" + media.id}>
                  <img className="w-full bg-gray-500 " src={media.coverImage.large} alt={media.title.romaji} />
                  <h1 class=" text-white text-base font-bold">{media.title.romaji}</h1>
                </Link>
              </div>
            )
          }
        })}
      </div>
        <Pagination page={props.page} search={props.search} lastpage={data.Page.pageInfo.lastPage} perpage={props.perpage} />
      </>
    )
  }
}
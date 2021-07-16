import { useQuery } from '@urql/preact'

export function Comment(props) {
    const [{ fetching, data, error }] = useQuery({
        query: `query ($id: Int) {
            Review(id: $id) {
              user {
                id
                name
              }
              userRating
              body
            }
          }
    `,
        variables: { id: props.id}

    });
if (fetching==false) {
    return (<li class="bg-[#19222d] text-white"><a href="chapter.html">
                            <img class=" mt-2 ml-2 inline" src="" width="48" height="48" />
                            <span class="ml-2 mt-2">{data.Review.user.name}</span>
                            <span class=" text-xs float-right inline mt-4 mr-4">{data.Review.userRating}</span>
                        </a>
                            <div class=" mt-2 mx-4 text-sm block">
                            {data.Review.body}
                </div>
                            <a class="btn p-3 float-right inline"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg></a>

                        </li>)}
}
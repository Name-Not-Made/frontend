import { Link, route } from 'preact-router'

function search(query) {
    route(`/search/${encodeURIComponent(query)}`);
}
export function Topbarb() {
    return (
        <>
            <div class=" top-0 w-full fixed bg-gray-900">
<a class=" btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="-mt-1 h-6 w-6 inline  " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg                 > 
              Menu
        </a>               

                
                <a class="btn float-right">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>Login
        </a>
            </div>


        </>
    )
}

export function Topbar() {
    return (
        <>
            <div class=" top-0 w-full fixed bg-gray-900">
<a class=" btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="-mt-1 h-6 w-6 inline  " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg                 > 
              Menu
        </a>               

                <input placeholder="Search..." style="width: calc(80vw - 10rem);margin-left:10vw;"
                    class=" bg-gray-700 hidden text-gray-50 appearance-none focus:ring-gray-600 px-3 py-2 focus:border-gray-600 flex-1 border-gray-800 sm:inline-block"
                    type="search" onSearch={e => search(e.target.value)} name="search" id="search" />

                <a class="btn float-right">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>Login
        </a>
            </div>


        </>
    )
}

export function Pagination(props) {
    var offset = 0
    if (Number(props.page) == 0) {
        props.page = 1
    }
    if (Number(props.page) < 3) {
        offset = 2
    }
    if (props.perpage == undefined) {
        props.perpage = ''
    }
    var sera = '/search/'+ props.search
    if (props.search == undefined) {
        sera = ''
    }
    return (
        <center>
            <div className=" mb-16  text-white mx-auto" >
                <Link href={ sera + '/1/' + props.perpage} className="btn mx-2"> &lt;&lt; </Link>
                <Link href={ sera +'/' + (Math.max(Number(props.page) - 1, 1)) + '/' + props.perpage} className="btn mx-2"> &lt; </Link>
                <Link href={ sera +'/' + checknegorzero(Number(props.page) - 2) + '/' + props.perpage} className="btn mx-2 hidden sm:inline-block">{checknegorzero(Number(props.page) - 2)}</Link>
                <Link href={ sera +'/' + checknegorzero(Number(props.page) - 1) + '/' + props.perpage} className="btn mx-2 hidden sm:inline-block">{checknegorzero(Number(props.page) - 1)}</Link>
                <Link className="btn bg-gray-800 mx-2">{Number(props.page)}</Link>
                <Link href={ sera +'/' + (checklastpage(Number(props.page) + 1)) + '/' + props.perpage} className="btn mx-2 hidden sm:inline-block">{checklastpage(Number(props.page) + 1)}</Link>
                <Link href={ sera +'/' + (checklastpage(Number(props.page) + 2)) + '/' + props.perpage} className="btn mx-2 hidden sm:inline-block">{checklastpage(Number(props.page) + 2)}</Link>
                <Link href={ sera +'/' + (Math.min(Number(props.page) + 1,props.lastpage)) + '/' + props.perpage} className="btn mx-2"> &gt; </Link>
                <Link href={ sera +'/' + (Number(props.lastpage)) + '/' + props.perpage} className="btn mx-2"> &gt;&gt; </Link>
            </div>
        </center>
    )
    function checklastpage(num) {
        if (num>Number(props.lastpage)) {
            return ''
        } else {
            return num
        }
    }
}
function checknegorzero(num) {
    if (num < 1) {
        return ''
    }
    return num
}
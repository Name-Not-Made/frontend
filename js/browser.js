var query = `
query ($id: Int, $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (id: $id, type: MANGA) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        chapters
      }
    }
  }
`;


var variables = {
    page: 1,
    perPage: 50
};

var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    var dataroot = data.data.Page.media
    for (i in dataroot) {
        document.getElementsByClassName("individual")[0].innerHTML+="<li><a><img width=120 height=180 alt='"+dataroot[i].title.romaji+"' src='"+ dataroot[i].coverImage.large +"'><p><b>"+dataroot[i].title.romaji + "</b></br><small>"+dataroot[i].chapters +" Chapters </small></p></a></li>"
      } 
    
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}

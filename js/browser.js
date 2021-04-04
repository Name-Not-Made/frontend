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
          medium
        }
        chapters
      }
    }
  }
`;


var variables = {
    page: 1,
    perPage: 3
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
    for (i in data.data.Page.media) {
        document.getElementsByClassName("individual")[0].innerHTML+="<li><a><img src='"+ data.data.Page.media[i].coverImage.medium +"'><p>"+data.data.Page.media[i].title.romaji + "</br>"+data.data.Page.media[i].chapters + "</p></a></li>"
      } 
    
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}
const BASE_URL = ' https://api.tvmaze.com';

export async function getList(){
    return await fetch(`${BASE_URL}/shows`).then(response => response.json());
}
export async function getDetails(id){
    return await fetch(`${BASE_URL}/shows/${id}`).then(response => response.json());
}
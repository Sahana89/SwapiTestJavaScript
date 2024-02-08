import { expect } from 'chai';
import qs from "qs";
/*
    SWAPI API - Star wars API
    This class contains all the tests for API call.
    It uses Junit to make assertions.
    The expected output has been defined locally within each test method.
    Term here refers to different object information such as people, vehicle, film, planet etc from star wars universe.
    Source of truth for expected output is from the website here: https://swapi.dev/
 */
class APICallTests {

    constructor() {
        this.BASE_URL = "https://swapi.dev/api/";
    }
    /*
        This method creates a URL for HTTP call to SWAP API.
        It uses 2 parameters term and search term and BASE url.
        Parameters String term, String searchTerm
        Return: URL.
        */
    createURL(term, searchTerm) {
        if (!term && !searchTerm) {
            return new URL(this.BASE_URL);
        }
        if (term && !searchTerm) {
            return new URL(this.BASE_URL + term);
        } else {
            const params = qs.stringify({ search: searchTerm });
            return new URL(`${this.BASE_URL + term}?${params}`);
        }
    }
    /*
        This method makes a call to SWAPI API.
        It returns json object with response body. If the status code is not OK then throws an error.
        Parameters String term, String searchTerm
        Return: json
        */
    request(term, searchTerm) {
        const url = this.createURL(term,searchTerm)
        return fetch(url).then((response)=>{
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        });
    }
    /*
        This test method makes the API call with BASE URL for SWAPI API.
        Expected output: 6 different API terms to be exists
        Parameters Term: empty
        Parameters Search Term: empty
        */
    async countAllAPITest() {
        const returnedResponse = await this.request("", "");
        expect(returnedResponse).to.exist;
    }

    /*
    This test method makes the API call with incorrect term.
    Expected output: Throws Exception.
    Parameters Term: /$/asde
    Parameters Search Term: empty
    */
    async invalidURLTest() {
        const returnedResponse = await this.request("/$/asde", "");
        expect(returnedResponse).throws(Error);
    }

    async searchReturnsResultsForSearchTerm() {
        const urlTerm = "people";
        const searchTerm = "luke";
        const searchResults = await this.request(urlTerm, searchTerm);
        expect(searchResults.count).to.equal(1);
        expect(searchResults.results).to.exist;
        expect(searchResults.results[0].name).to.equal("Luke Skywalker");
    }
    /*
        This test method makes the API call to search for people with incorrect search term.
        Expected output: Returns empty search results.
        Parameters Term: people
        Parameters Search Term: A new hope
        */
    async searchReturnsEmptyResultsForIncorrectSearchTerm() {
        const urlTerm = "people";
        const searchTerm = "A new hope";
        const searchResults = await this.request(urlTerm, searchTerm);
        expect(searchResults.count).to.equal(0);
        expect(searchResults.results).to.be.empty;
    }
    /*
       This test method makes the API call to search for people which returns more than 1 search results.
       Expected output: Returns 3 search results.
       Parameters Term: people
       Parameters Search Term: skywalker
       */
    async searchReturnsMoreThanOneResults() {
        const urlTerm = "people";
        const searchTerm = "skywalker";
        const searchResults = await this.request(urlTerm, searchTerm);
        expect(searchResults.count).to.equal(3);
        expect(searchResults.results).to.not.be.empty;
    }
    /*
        This test method makes the API call to search for people with empty search term
        Expected output: Returns all search results for people.
        Parameters Term: people
        Parameters Search Term: empty
        */
    async searchReturnsAllResultsforEmptySearchTerm() {
        const urlTerm = "people";
        const searchTerm = "";
        const searchResults = await this.request(urlTerm, searchTerm);
        expect(searchResults.count).to.equal(82);
        expect(searchResults.results).to.not.be.undefined;
    }

    /*
        This test method makes the API call to film with id =1
        Expected output: Returns a non-empty model.Film object.
        Parameters Term: films/1
        Parameters Search Term: empty
        */
    async getFilmById() {
        const urlTerm = "films/1";
        const searchTerm = "";
        const returnedResponse = await this.request(urlTerm, searchTerm);
        expect(returnedResponse.title).to.equal("A New Hope");
        expect(returnedResponse.episode_id).to.equal(4);
        expect(returnedResponse.director).to.equal("George Lucas");
        const planets = [
            "https://swapi.dev/api/planets/1/",
            "https://swapi.dev/api/planets/2/",
            "https://swapi.dev/api/planets/3/"
        ];
        expect(returnedResponse.planets).to.eql(planets);
    }
    /*
        This test method makes the API call to film with id = 72 (Only 60 planets)
        Expected output: Returns Object which contains "Not found"
        Parameters Term: planets/72
        Parameters Search Term: empty
        */
    async getPlanetByUsingIdWhichDoesNotExist() {
        const urlTerm = "planets/72";
        const searchTerm = "";
        const returnedResponse = await this.request(urlTerm, searchTerm);
        expect(returnedResponse).throws(Error);
    }
}

const apiCallTests = new APICallTests();
apiCallTests.countAllAPITest().then(r => {});
apiCallTests.invalidURLTest().catch(Error);
apiCallTests.searchReturnsResultsForSearchTerm().then(r => {});
apiCallTests.searchReturnsEmptyResultsForIncorrectSearchTerm().then(r => {});
apiCallTests.searchReturnsMoreThanOneResults().then(r => {});
apiCallTests.searchReturnsAllResultsforEmptySearchTerm().then(r => {});
apiCallTests.getFilmById().then(r => {});
apiCallTests.getPlanetByUsingIdWhichDoesNotExist().catch(Error);



using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using Codewithsteve.Microservices.BugsTracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Codewithsteve.BugsTracker.Auth.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : Controller
    {
        HttpClient httpClient = new HttpClient();
        //string url = "https://localhost:44330/";
        string url = "http://bugsapi.uksouth.cloudapp.azure.com/";

        // GET: api/<ClientController>
        [HttpGet]
        public IActionResult Get()
        {
            var result = "nothing";
            HttpResponseMessage response = httpClient.GetAsync(url+"Clients").Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<List<ClientViewModel>>().Result;
                return Ok(results);
            } else
            {
                //throw new HttpRequestException(response.ReasonPhrase);
                return Ok(response.ReasonPhrase + " " + result);
            }
        }

        // GET api/<ClientController>/5
        [HttpGet("{id}")]
        public ActionResult Get(string id)
        {
            HttpResponseMessage response = httpClient.GetAsync(url+"Clients/"+id).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<Client>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // POST api/<ClientController>
        [HttpPost]
        public ActionResult PostClient([FromBody] Client client)
        {
            HttpResponseMessage response = httpClient.PostAsync(url + "Clients", client, new JsonMediaTypeFormatter()).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<IEnumerable<Client>>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // PUT api/<ClientController>/5
        [HttpPut("{id}")]
        public IActionResult PutClient(string id, [FromBody] Client client)
        {
            HttpResponseMessage response = httpClient.PutAsync(url + "Clients/" + id, client, new JsonMediaTypeFormatter()).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<IEnumerable<Client>>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // DELETE api/<ClientController>/5
        [HttpDelete("{id}")]
        public ActionResult DeleteClient(string id)
        {
            HttpResponseMessage response = httpClient.DeleteAsync(url + "Clients/" + id).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<Client>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }
    }
}

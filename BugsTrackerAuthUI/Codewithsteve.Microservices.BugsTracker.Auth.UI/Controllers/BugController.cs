using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Formatting;
using Codewithsteve.Microservices.BugsTracker.Models;
using Microsoft.AspNetCore.Mvc;

namespace Codewithsteve.BugsTracker.Auth.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BugController : Controller
    {
        HttpClient httpClient = new HttpClient();
        string url = "http://bugsapi.uksouth.cloudapp.azure.com/";

        // GET: api/<BugController>
        [HttpGet]
        public IActionResult GetBug()
        {
            HttpResponseMessage response = httpClient.GetAsync(url + "bugs").Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<List<Bug>>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // GET api/<BugController>/5
        [HttpGet("{id}")]
        public ActionResult GetOneBug(string id)
        {
            HttpResponseMessage response = httpClient.GetAsync(url + "bugs/" + id).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<Bug>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // POST api/<BugController>
        [HttpPost]
        public ActionResult PostClient([FromBody] Bug bug)
        {
            HttpResponseMessage response = httpClient.PostAsync(url + "bugs", bug, new JsonMediaTypeFormatter()).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<IEnumerable<Bug>>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // PUT api/<BugController>/5
        [HttpPut("{id}")]
        public IActionResult PutClient(string id, [FromBody] Bug bug)
        {
            HttpResponseMessage response = httpClient.PutAsync(url + "bugs/" + id, bug, new JsonMediaTypeFormatter()).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<IEnumerable<Bug>>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }

        // DELETE api/<BugController>/5
        [HttpDelete("{id}")]
        public ActionResult DeleteClient(string id)
        {
            HttpResponseMessage response = httpClient.DeleteAsync(url + "bugs/" + id).Result;
            if (response.IsSuccessStatusCode)
            {
                var results = response.Content.ReadAsAsync<Bug>().Result;
                return Ok(results);
            }
            else
            {
                throw new HttpRequestException(response.ReasonPhrase);
            }
        }
    }
}

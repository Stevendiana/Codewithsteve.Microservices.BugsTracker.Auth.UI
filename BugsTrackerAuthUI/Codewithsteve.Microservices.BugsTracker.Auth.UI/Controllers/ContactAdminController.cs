using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Collections.Generic;
using Codewithsteve.Microservices.BugsTracker.Models;
using System.Threading.Tasks;

namespace Codewithsteve.BugsTracker.Auth.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactAdminController : Controller
    {
        public ContactAdminController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [HttpPost]
        public async Task<ActionResult> SendEmailAsync([FromBody] Contact contact)
        {
           

            if (!ModelState.IsValid) // return validation error if client side validation is not passed.
            {
                return BadRequest(ModelState);
            }

            string fromAddress = Configuration["Key:FromAddress"];
            string SubjectName = contact.Subject + " " + "-" + " " + contact.Email;
            string ToAddress = "steve@code-with-steve.com";
            string AzureSendGridKey = Configuration["Key:AzureSendGridKey"];
            var client = new SendGridClient(AzureSendGridKey);
            var msg = new SendGridMessage();

            msg.SetFrom(new EmailAddress(fromAddress, SubjectName));

            var recipients = new List<EmailAddress>
                {
                    new EmailAddress(ToAddress)
                };
            msg.AddTos(recipients);

            msg.SetSubject(SubjectName);

            //msg.AddContent(MimeType.Text, messages);  
            msg.AddContent(MimeType.Html, contact.Message);
            var response = await client.SendEmailAsync(msg);
            if(response.IsSuccessStatusCode)
            {
                return Ok(response);

            } else
            {
                return BadRequest(response.StatusCode);
            }


        }
    }
}

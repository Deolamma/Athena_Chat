using Microsoft.AspNetCore.SignalR;

namespace AthenaChatServer.Hubs
{
    public class AthenaChat : Hub
    {
        // SendMessage() is called by client, when it has to communicate.
        // RecieveMessage() is called when server needs to notify clients
        public async Task SendMessage(string userName, string text)
        {
            await Clients.All.SendAsync("RecieveMessage", userName, text);
        }

        public async Task JoinChat(string userName, string text)
        {
            await Clients.Others.SendAsync("ReceiveMessage", userName, text);
        }
    }
}

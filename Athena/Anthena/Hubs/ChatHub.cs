using Microsoft.AspNetCore.SignalR;

namespace Anthena.Hubs
{
    public class ChatHub: Hub
    {


        private static Dictionary<string, string> connectedClients = new Dictionary<string, string>();
        // this method  will send notification to all the clients
        // if client has to communicate, it will call SendMessage()
        //if client have to recieve notification from server it will use RecieveMesage()
        public async Task SendMessage (string user, string message )
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinChat(string user, string message)
        {
            connectedClients[Context.ConnectionId] = user;
            await Clients.Others.SendAsync("ReceiveMessage", user, message);
        }
        private async Task LeaveChat()
        {
            if (connectedClients.TryGetValue(Context.ConnectionId, out string 
                user)) 
            {
                var message = $"{user} left the chat";
                await Clients.Others.SendAsync("ReceiveMessage", user, message);
            }
        }

        public override async Task OnDisconnectedAsync(Exception ? exception)
        {
            await LeaveChat();
            await base.OnDisconnectedAsync(exception);
        }

    }
}

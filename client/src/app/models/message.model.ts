export class Message {
    public text: string;
    public sender: string;
    public date: Date;
    public reply?: boolean;
    public avatar?: string;
   
    constructor(text: string, sender: string) {
      this.text = text;
      this.sender = sender;
      this.avatar = '';
      this.date = new Date();
    }
  
    public static setReply(message: Message, sender: string) {
      return {
        ...message,
        reply: message.sender === sender,
      };
    }
  
  }
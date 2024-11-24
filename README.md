# Real-Time Chat Application with Custom WebSocket Server

I built a real-time chat application featuring a chat UI developed with **React Native and Expo** for both mobile and web platforms. The backend is powered by a **custom WebSocket server implemented from scratch**, diving deep into the WebSocket protocol, including handshakes, framing, and message parsing using bitwise operations.

### Features

- **Custom WebSocket Server**: Implemented without relying on external libraries.
- **Real-Time Communication**: Enables instant messaging between clients.
- **Bitwise Operations**: Utilized for encrypting and decrypting messages from buffers.
- **Cross-Platform Chat UI**: Supports iOS, Android, and web browsers via React Native and Expo.

### Project Structure

- **backend**: Contains the custom WebSocket server implementation.
- **frontend**: Includes the chat UI for mobile and web platforms.

---

### Installation Instructions

1. **Clone the Repository**

   ```bash
   git clone git@github.com:mrpmohiburrahman/web-socket-from-scratch.git
   cd web-socket-from-scratch
   ```

2. **Backend Setup**:

   - Navigate to the `backend` folder:

     ```bash
     cd backend
     ```

   - Install the dependencies:

     ```bash
     pnpm install
     ```

3. **Frontend Setup**:

   - Navigate to the `frontend` folder:

     ```bash
     cd ../frontend
     ```

   - Install the dependencies:

     ```bash
     pnpm install
     ```

---

### Running the Application

1. **Backend**:

   - Start the server from the `backend` folder:

     ```bash
     pnpm dev
     ```

   - Server logs will be displayed in the terminal.

2. **Frontend**:

   - Navigate to the `frontend` folder if you're not already there:

     ```bash
     cd ../frontend
     ```

   - Choose the platform to run:

     - **For iOS**:

       ```bash
       pnpm ios
       ```

     - **For Android**:

       ```bash
       pnpm android
       ```

     - **For Web Browser**:

       ```bash
       pnpm web
       ```

---

### Technical Details

- **WebSocket Protocol Handling**: Manually handled the WebSocket handshake process, including the upgrade from HTTP to the WebSocket protocol.
- **Bitwise Operations**: Explored and implemented bitwise operations to parse and construct WebSocket frames, managing masking and unmasking of payload data.
- **Low-Level Networking Insight**: Gained a deeper understanding of real-time communication at the protocol level by not relying on abstractions provided by libraries.

---

### Future Plans

- **Build Redux from Scratch**: Planning to implement Redux from the ground up to integrate state management into this app.
- **Custom Database Implementation**: Intend to create a database from scratch to store chat history and manage data persistence.
- **Develop a Node Server from Scratch**: Aiming to build a Node.js server without using any frameworks to serve as the backend for this application.

---

Feel free to explore the code, and any feedback or suggestions are welcome!

---

**Note**: Ensure you have `pnpm` installed globally to run the commands above. If not, you can install it using `npm install -g pnpm`.

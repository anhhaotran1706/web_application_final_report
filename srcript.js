// Dữ liệu cục bộ mô phỏng (không có backend)
let notebooks = [
  {id: 1, name: "Dự án AI", sources: []},
  {id: 2, name: "Kế hoạch Marketing", sources: []},
  {id: 3, name: "Ghi chú học tập", sources: []}
];
let currentNotebookId = null;

// Tham chiếu tới các phần tử DOM
const notebookListEl = document.getElementById('notebookList');
const sourceListEl = document.getElementById('sourceList');
const chatEl = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const dropZone = document.getElementById('dropZone');
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const toggleLeft = document.getElementById('toggle-left');
const toggleRight = document.getElementById('toggle-right');
const newNotebookBtn = document.getElementById('newNotebookBtn');

// Hàm vẽ lại danh sách sổ tay
function renderNotebooks() {
  notebookListEl.innerHTML = "";
  notebooks.forEach(nb => {
    let li = document.createElement('li');
    li.textContent = nb.name;
    li.dataset.id = nb.id;
    if (nb.id === currentNotebookId) {
      li.classList.add('selected');
    }
    notebookListEl.appendChild(li);
    li.addEventListener('click', () => selectNotebook(nb.id));
  });
}

// Chọn một sổ tay (hiển thị sources và chuyển chat)
function selectNotebook(id) {
  currentNotebookId = id;
  // đánh dấu mục đã chọn
  document.querySelectorAll('.notebook-list li').forEach(li => li.classList.remove('selected'));
  const sel = document.querySelector(`.notebook-list li[data-id='${id}']`);
  if (sel) sel.classList.add('selected');
  // Hiển thị sources của sổ tay
  const notebook = notebooks.find(x => x.id === id);
  sourceListEl.innerHTML = "";
  notebook.sources.forEach(src => {
    let li = document.createElement('li');
    li.textContent = src;
    sourceListEl.appendChild(li);
  });
  // Xóa chat hiện tại và hiện thông báo mới
  chatEl.innerHTML = "";
  let welcome = document.createElement('div');
  welcome.className = 'welcome-text';
  welcome.innerHTML = '<p>Bắt đầu đặt câu hỏi của bạn cho sổ tay "'+ notebook.name +'".</p>';
  chatEl.appendChild(welcome);
}

// Tạo sổ tay mới
newNotebookBtn.addEventListener('click', () => {
  const name = prompt("Tên sổ tay mới:");
  if (!name) return;
  const id = Date.now();
  notebooks.push({id, name, sources: []});
  renderNotebooks();
});

// Xử lý drag & drop (kéo-thả file)
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.background = '#eef';
});
dropZone.addEventListener('dragleave', () => {
  dropZone.style.background = '';
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.background = '';
  const files = e.dataTransfer.files;
  if (currentNotebookId == null) {
    alert("Chọn hoặc tạo sổ tay trước khi tải lên tài liệu.");
    return;
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    notebooks.find(x => x.id === currentNotebookId).sources.push(file.name);
  }
  // Cập nhật lại UI sources
  selectNotebook(currentNotebookId);
});

// Gửi tin nhắn (Chat giả lập)
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  if (currentNotebookId == null) {
    alert("Chọn một sổ tay để gửi câu hỏi.");
    return;
  }
  // Tin nhắn người dùng
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = text;
  chatEl.appendChild(userMsg);
  // Tin nhắn bot (placeholder)
  const botMsg = document.createElement('div');
  botMsg.className = 'message bot';
  botMsg.textContent = 'Đang suy nghĩ...';
  chatEl.appendChild(botMsg);
  // Cuộn xuống dưới
  chatEl.scrollTop = chatEl.scrollHeight;
  messageInput.value = '';
  // Phản hồi giả lập sau 1.5s
  setTimeout(() => {
    botMsg.textContent = 'Đây là phản hồi giả lập cho: ' + text;
    chatEl.scrollTop = chatEl.scrollHeight;
  }, 1500);
}

// Sự kiện nút gửi / Enter
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Toggle ẩn/hiện panel trái/phải (mobile)
toggleLeft.addEventListener('click', () => {
  leftPanel.classList.toggle('open');
});
toggleRight.addEventListener('click', () => {
  rightPanel.classList.toggle('open');
});

// Khởi tạo ban đầu
renderNotebooks();

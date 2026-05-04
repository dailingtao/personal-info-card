function encodeData(name, age) {
  const data = JSON.stringify({ name, age });
  return btoa(encodeURIComponent(data));
}

function decodeData(encoded) {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function generateShareUrl(name, age) {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeData(name, age);
  return `${baseUrl}?d=${encoded}`;
}

let currentShareUrl = '';

function updateDisplay(name, age) {
  document.getElementById('name').textContent = name;
  document.getElementById('age').textContent = `年龄：${age}`;
  currentShareUrl = generateShareUrl(name, age);
  const shareUrlInput = document.getElementById('shareUrl');
  if (shareUrlInput) {
    shareUrlInput.value = currentShareUrl;
  }
}

function generateQRCode(url) {
  const qrcode = document.getElementById('qrcode');
  qrcode.innerHTML = '';
  
  new QRCode(qrcode, {
    text: url,
    width: 160,
    height: 160,
    colorDark: '#333',
    colorLight: '#fff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('链接已复制到剪贴板！');
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请手动复制');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const dataParam = getUrlParam('d');
  
  if (dataParam) {
    const decoded = decodeData(dataParam);
    if (decoded && decoded.name && decoded.age) {
      updateDisplay(decoded.name, decoded.age);
      document.body.classList.add('hide-controls');
    }
  }
  
  document.getElementById('configForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('inputName').value.trim();
    const age = document.getElementById('inputAge').value.trim();
    
    if (!name) {
      alert('请输入姓名');
      return;
    }
    
    if (!age || isNaN(age) || parseInt(age) < 1 || parseInt(age) > 150) {
      alert('请输入有效的年龄（1-150）');
      return;
    }
    
    const shareUrl = generateShareUrl(name, age);
    updateDisplay(name, age);
    generateQRCode(shareUrl);
    document.getElementById('shareSection').style.display = 'block';
  });
  
  document.getElementById('copyBtn').addEventListener('click', function() {
    if (currentShareUrl) {
      copyToClipboard(currentShareUrl);
    } else {
      alert('请先生成链接');
    }
  });
});
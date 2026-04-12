// Notyf
var notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top'
  },
  dismissible: true
});

const notifyData = sessionStorage.getItem('notify');
if(notifyData){
  const { code, message} = JSON.parse(notifyData);
  if(code == 'error'){
    notyf.error(message);
  } else if(code == 'success'){
    notyf.success(message);
  }
  sessionStorage.removeItem('notify');
}

// Hàm vẽ ra thông báo khi reload lại trang 
const drawNotyf = (code, message) => {
  sessionStorage.setItem("notify", JSON.stringify({
    code: code,
    message: message
  }));
}

// End Notyf

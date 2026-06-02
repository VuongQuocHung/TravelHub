
// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if(buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");

  // Click vào button mở menu
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Click vào overlay đóng menu
  const overlay = menu.querySelector(".inner-overlay");
  if(overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  // Click vào icon down mở sub menu
  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach(button => {
    button.addEventListener("click", () => {
      button.parentNode.classList.toggle("active");
    })
  });
}
// End Menu Mobile

// Box Address Section 1
const boxAddressSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-address");
if(boxAddressSection1) {
  // Ẩn/hiện box suggest
  const input = boxAddressSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  })

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  })

  // Sự kiện click vào từng item
  const listItem = boxAddressSection1.querySelectorAll(".inner-suggest-list .inner-item");
  listItem.forEach(item => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      if(title) {
        input.value = title;
      }
    })
  })
}
// End Box Address Section 1

// Box User Section 1
const boxUserSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-user");
if(boxUserSection1) {
  // Hiện box quantity
  const input = boxUserSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  })

  // Ẩn box quantity
  document.addEventListener("click", (event) => {
    // Kiểm tra nếu click không nằm trong khối `.inner-box.inner-user`
    if (!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove("active");
    }
  });

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(".inner-count .inner-number");
    const listNumber = [];
    listBoxNumber.forEach(boxNumber => {
      const number = parseInt(boxNumber.innerHTML.trim());
      listNumber.push(number);
    })
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  }

  // Bắt sự kiện click nút up
  const listButtonUp = boxUserSection1.querySelectorAll(".inner-count .inner-up");
  listButtonUp.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    })
  })

  // Bắt sự kiện click nút down
  const listButtonDown = boxUserSection1.querySelectorAll(".inner-count .inner-down");
  listButtonDown.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      if(number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
        updateQuantityInput();
      }
    })
  })
}
// End Box User Section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if(clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");

  // Chuyển đổi chuỗi thời gian thành đối tượng Date
  const expireDateTime = new Date(expireDateTimeString);

  // Hàm cập nhật đồng hồ
  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now; // quy về đơn vị mili giây
    
    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      // Tính số ngày, 24 * 60 * 60 * 1000 Tích của các số này = số mili giây trong 1 ngày

      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      // Tính số giờ, 60 * 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số giờ.
      // % 24 Lấy phần dư khi chia tổng số giờ cho 24 để chỉ lấy số giờ còn lại trong ngày.

      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      // Tính số phút, 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số phút.
      // % 60 Lấy phần dư khi chia tổng số phút cho 60 để chỉ lấy số phút còn lại trong giờ.

      const seconds = Math.floor((remainingTime / 1000) % 60);
      // Tính số giây, 1000 Chia remainingTime cho giá trị này để nhận được tổng số giây.
      // % 60 Lấy phần dư khi chia tổng số giây cho 60 để chỉ lấy số giây còn lại trong phút.

      // Cập nhật giá trị vào thẻ span
      const listBoxNumber = clockExpire.querySelectorAll('.inner-number');
      listBoxNumber[0].innerHTML = `${days}`.padStart(2, '0');
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, '0');
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, '0');
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, '0');
    } else {
      // Khi hết thời gian, dừng đồng hồ
      clearInterval(intervalClock);
    }
  }

  // Gọi hàm cập nhật đồng hồ mỗi giây
  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Box Filter
const buttonFilterMobile = document.querySelector(".section-9 .inner-filter-mobile");
if(buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");
  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  })

  const overlay = document.querySelector(".section-9 .inner-left .inner-overlay");
  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  })
}
// End Box Filter

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if(boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    boxTourInfo.classList.add("active");
  })

  new Viewer(boxTourInfo);
}
// End Box Tour Info

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");
if(swiperSection2) {
  new Swiper('.swiper-section-2', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if(swiperSection3) {
  new Swiper('.swiper-section-3', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 3

// Swiper Box Images
const boxImages = document.querySelector(".box-images");
if(boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 5,
    slidesPerView: 4,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });

  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 0,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Swiper Box Images

// Zoom Box Images Main
const boxImagesMain = document.querySelector(".box-images .inner-images-main");
if(boxImagesMain) {
  new Viewer(boxImagesMain);
}
// End Zoom Box Images Main

// Box Tour Schedule
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if(boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Box Tour Schedule

// Email Form
const emailForm = document.querySelector("#email-form");
if(emailForm) {
  const validation = new JustValidate('#email-form');

  validation
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email của bạn!',
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;

      const dataFinal = {
        email: email,
      }
      fetch(`/contact/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notyf.error(data.message);
          }
          if(data.code == "success") {
            notyf.success(data.message);
          }
        })
    })
  ;
}
// End Email Form

// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if(couponForm) {
  const validation = new JustValidate('#coupon-form');

  validation
    .onSuccess((event) => {
      const coupon = event.target.coupon.value;
      console.log(coupon);
    })
  ;
}
// End Email Form

// Order Form
const orderForm = document.querySelector("#order-form");
if(orderForm) {
  const validation = new JustValidate('#order-form');

  validation
    .addField('#full-name-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#phone-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.method.value;
      const cart = JSON.parse(localStorage.getItem("cart"));
      const toursChecked = [];
      cart.forEach(item => {
        if(item.checked) {
          toursChecked.push({
            tourId: item.tourId,
            locationFrom: item.locationFrom,
            quantityAdult: item.listQuantity.adult,
            quantityChildren: item.listQuantity.children,
            quantityBaby: item.listQuantity.baby
          });
        }
      });

      if(toursChecked.length == 0) {
        notyf.error("Vui lòng chọn ít nhất 1 tour!");
        return;
      }
      const dataFinal = {
        fullName: fullName,
        phone: phone,
        note: note,
        paymentMethod: paymentMethod,
        toursChecked: toursChecked,
      }
      fetch(`/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notyf.error(data.message);
          }
          if(data.code == "success") {
            // Xóa các tour đã đặt trong giỏ hàng
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const cartFilter = cart.filter(item => item.checked == false);
            localStorage.setItem("cart", JSON.stringify(cartFilter));


            switch (paymentMethod) {
              case "money":
                notyf.success("Bạn đã chọn thanh toán tiền mặt khi đi tour!");
                break;
              case "bank":
                drawNotyf(data.code, data.message);
                window.location.href = `/order/success?orderCode=${data.orderCode}&phone=${phone}`;
                break;

              case "zalopay":
                // Mở trang thanh toán ZaloPay
                window.location.href = `/order/payment-zalopay?orderCode=${data.orderCode}&phone=${phone}`;
                break;
              case "vnpay":
                // Mở trang thanh toán VNPAY
                window.location.href = `/order/payment-vnpay?orderCode=${data.orderCode}&phone=${phone}`;
                break;
            }
          }
        })
    })
  ;

  // List Input Method
  const listInputMethod = orderForm.querySelectorAll("input[name='method']");
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");

  listInputMethod.forEach(inputMethod => {
    inputMethod.addEventListener("change", () => {
      if (inputMethod.value == "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    })
  })
  // End List Input Method
}
// End Order Form

// Box Filter
const boxFilter = document.querySelector(".box-filter");
if(boxFilter) {
  const url = new URL(`${window.location.origin}/search`);
  const filterList = [
    "category",
    "locationFrom",
    "locationTo",
    "departureDate",
    "stockAdult",
    "stockChildren",
    "stockBaby",
    "price"
  ];
  const buttonApply = boxFilter.querySelector(".inner-button"); // Bắt sự kiện click nút apply
  buttonApply.addEventListener("click", () => {
    filterList.forEach(key => {
    const value = boxFilter.querySelector(`[name="${key}"]`).value;
    if(value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.location.href = url.href;
});

  // Hiển thị lựa chọn mặc định
  const urlCurrent = new URL(window.location.href);
  filterList.forEach(key => {
    const value = urlCurrent.searchParams.get(key);
    if(value) {
      boxFilter.querySelector(`[name="${key}"]`).value = value;
    }
  });

}
// End Box Filter

// Box Search
const boxSearch = document.querySelector("[box-search]");
if(boxSearch) {
  const url = new URL(`${window.location.origin}/search`);

  const buttonApply = boxSearch.querySelector(".inner-button");

  buttonApply.addEventListener("click", () => {
    // Điểm đến
    const locationTo = boxSearch.querySelector("[name='locationTo']").value;
    if(locationTo) {
      url.searchParams.set("locationTo", locationTo);
    } else {
      url.searchParams.delete("locationTo");
    }

    // Số lượng
    // Người lớn
    const stockAdult = parseInt(boxSearch.querySelector(`[name="stockAdult"]`).innerHTML);
    if(stockAdult > 0) {
      url.searchParams.set("stockAdult", stockAdult);
    } else {
      url.searchParams.delete("stockAdult");
    }

    // Trẻ em
    const stockChildren = parseInt(boxSearch.querySelector(`[name="stockChildren"]`).innerHTML);
    if(stockChildren > 0) {
      url.searchParams.set("stockChildren", stockChildren);
    } else {
      url.searchParams.delete("stockChildren");
    }

    // Em bé
    const stockBaby = parseInt(boxSearch.querySelector(`[name="stockBaby"]`).innerHTML);
    if(stockBaby > 0) {
      url.searchParams.set("stockBaby", stockBaby);
    } else {
      url.searchParams.delete("stockBaby");
    }

    // Ngày khởi hành
    const departureDate = boxSearch.querySelector("[name='departureDate']").value;
    if(departureDate) {
      url.searchParams.set("departureDate", departureDate);
    } else {
      url.searchParams.delete("departureDate");
    }

    window.location.href = url.href;
  });
}
// End Box Search

const updateMiniCart = () => {
  const miniCart = document.querySelector("[mini-cart]");
  if(miniCart){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    miniCart.innerHTML = cart.length;
  }
}
updateMiniCart();

// box-tour-detail 
const boxTourDetail = document.querySelector(".box-tour-detail");
if(boxTourDetail) {
  // Tăng/giảm số lượng
  const listInputQuantity = boxTourDetail.querySelectorAll("input[input-quantity]");
  listInputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      // Cập nhật số lượng
      let quantity = parseInt(input.value);
      const type = input.getAttribute("input-quantity");
      const max = parseInt(input.getAttribute("max"));
      if(quantity > max){
        input.value = max;
        notyf.error(`Chỉ còn lại ${max} chỗ!`);
      }
      if(quantity < 0) {
        input.value = 0;
      }
      quantity = parseInt(input.value);
      const spanQuantity = boxTourDetail.querySelector(`[quantity="${type}"]`);
      spanQuantity.innerHTML = quantity;
      // Tính tổng tiền
      let totalPrice = 0;
      listInputQuantity.forEach(item => { // Duyệt qua tất cả input để tính tổng tiền
        const soluong = parseInt(item.value);
        const gia = parseInt(item.getAttribute("price"));
        totalPrice += soluong * gia; 
      })
      const elementTotalPrice = boxTourDetail.querySelector("[total-price]");
      elementTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");
    });
  });

  // Thêm vào giỏ hàng
  const buttonAddCart = boxTourDetail.querySelector(".inner-button-add-cart");
  buttonAddCart.addEventListener("click", () => {
    const tourId = buttonAddCart.getAttribute("tourId");
    const locationFrom = boxTourDetail.querySelector("[locationFrom]").value;
    let listQuantity = {}
    listInputQuantity.forEach(item => {
      const type = item.getAttribute("input-quantity");
      const quantity = parseInt(item.value);
      listQuantity[type] = quantity;
    });

    if(!locationFrom) {
      notyf.error("Vui lòng chọn nơi khởi hành!");
      return;
    }

    if(!(listQuantity.adult > 0 || listQuantity.children > 0 || listQuantity.baby > 0)) {
      notyf.error("Vui lòng chọn ít nhất một loại vé!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const indexItemExist = cart.findIndex(item => item.tourId == tourId);
    if(indexItemExist > -1) {
      // Nếu tour đã tồn tại trong giỏ hàng thì cập nhật lại thông tin
      cart[indexItemExist].listQuantity.adult += listQuantity.adult; 
      cart[indexItemExist].listQuantity.children += listQuantity.children;
      cart[indexItemExist].listQuantity.baby += listQuantity.baby;
      cart[indexItemExist].locationFrom = locationFrom; // Cập nhật lại nơi khởi hành
      notyf.success("Cập nhật giỏ hàng thành công!");
    } else {
      const item = {
      tourId: tourId,
      locationFrom: locationFrom,
      listQuantity: listQuantity,
      checked: true, // Mặc định khi thêm vào giỏ hàng sẽ được chọn
    }
      cart.unshift(item); // Nếu tour chưa tồn tại trong giỏ hàng thì thêm vào đầu mảng
      notyf.success("Thêm vào giỏ hàng thành công!");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateMiniCart();
  });
}

// End box-tour-detail

// Hàm vẽ giỏ hàng (call lại mỗi khi có sự thay đổi về số lượng trong giỏ hàng)
const drawCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) ;
  fetch(`/cart/detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart: cart
    })
  })
  .then(res => res.json( ))
  .then(data => {
    if(data.code == "success") {
      let subTotal = 0;
      const htmlArray = data.cartDetail.map(item => {
        if(item.checked) { // Chỉ tính tổng tiền nếu tour được chọn
          subTotal  += item.detail.priceNewAdult * item.listQuantity.adult 
                    + item.detail.priceNewChildren * item.listQuantity.children 
                    + item.detail.priceNewBaby * item.listQuantity.baby;
        }
        return `
          <div class="inner-tour-item">
            <div class="inner-actions">
              <button class="inner-delete" button-delete tour-id="${item.tourId}">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <input type="checkbox" class="inner-check" ${item.checked ? "checked" : ""} tour-id="${item.tourId}">
            </div>
            <div class="inner-product">
              <div class="inner-image">
                <a href="/tour/detail/${item.detail.slug}">
                  <img src="${item.detail.avatar}" alt="${item.detail.name}">
                </a>
              </div>
              <div class="inner-content">
                <div class="inner-title">
                  <a href="/tour/detail/${item.detail.slug}">
                    ${item.detail.name}
                  </a>
                </div>
                <div class="inner-meta">
                  <div class="inner-meta-item">
                    Mã Tour: <b>123456789</b>
                  </div>
                  <div class="inner-meta-item">
                    Ngày Khởi Hành: <b>${item.detail.departureDate}</b>
                  </div>
                  <div class="inner-meta-item">
                    Khởi Hành Tại: <b>${item.detail.locationFromName}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="inner-quantity">
              <label class="inner-label">Số Lượng Hành Khách</label>
              <div class="inner-list">
                <div class="inner-item">
                  <div class="inner-item-label">
                    Người lớn:
                  </div>
                  <div class="inner-item-input">
                    <input 
                      type="number" 
                      min="0" 
                      max="${item.detail.stockAdult}" 
                      value="${item.listQuantity.adult}"
                      type-customer="adult"
                      tour-id="${item.tourId}"
                    >
                  </div>
                  <div class="inner-item-price">
                    <span>${item.listQuantity.adult}</span>
                    <span>x</span>
                    <span class="inner-highlight">${item.detail.priceNewAdult.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
                <div class="inner-item">
                  <div class="inner-item-label">
                    Trẻ em:
                  </div>
                  <div class="inner-item-input">
                    <input 
                      type="number" 
                      min="0" 
                      max="${item.detail.stockChildren}" 
                      value="${item.listQuantity.children}"
                      type-customer="children"
                      tour-id="${item.tourId}"
                    >
                  </div>
                  <div class="inner-item-price">
                    <span>${item.listQuantity.children}</span>
                    <span>x</span>
                    <span class="inner-highlight">${item.detail.priceNewChildren.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
                <div class="inner-item">
                  <div class="inner-item-label">
                    Em bé:
                  </div>
                  <div class="inner-item-input">
                    <input 
                      type="number" 
                      min="0" 
                      max="${item.detail.stockBaby}" 
                      value="${item.listQuantity.baby}"
                      type-customer="baby"
                      tour-id="${item.tourId}"
                    >
                  </div>
                  <div class="inner-item-price">
                    <span>${item.listQuantity.baby}</span>
                    <span>x</span>
                    <span class="inner-highlight">${item.detail.priceNewBaby.toLocaleString("vi-VN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      })
      const elementTourList = boxCart.querySelector(".inner-tour-list");
      elementTourList.innerHTML = htmlArray.join("");

      const discount = 0;
      const totalPrice = subTotal - discount;
      const elementSubTotal = boxCart.querySelector("[sub-total]");
      const elementDiscount = boxCart.querySelector("[discount]");
      const elementTotalPrice = boxCart.querySelector("[total-price]");
      elementSubTotal.innerHTML = subTotal.toLocaleString("vi-VN");
      elementDiscount.innerHTML = discount.toLocaleString("vi-VN");
      elementTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");

      // Cập nhật lại số lượng trong giỏ hàng khi có sự thay đổi
      if(cart.length != data.cartDetail.length) {
        data.cartDetail.forEach(item => delete item.detail); // Xóa trường detail để cập nhật lại số lượng dễ dàng hơn
        localStorage.setItem("cart", JSON.stringify(data.cartDetail));
        updateMiniCart();
      }
      // Bắt sự kiện tăng giảm số lượng khách hàng
      const listInputTypeCustomer = boxCart.querySelectorAll("input[type-customer]");
      listInputTypeCustomer.forEach(input => {
        input.addEventListener("change", () => {
          const tourId = input.getAttribute("tour-id");
          const type = input.getAttribute("type-customer");
          const quantity = parseInt(input.value);
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const indexItem = cart.findIndex(item => item.tourId == tourId);
          if(indexItem > -1) {
            cart[indexItem].listQuantity[type] = quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart();
          }
        });
      });

      // Bắt sự kiện xóa từng tour
      const listButtonDelete = boxCart.querySelectorAll("[button-delete]");
      listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
          const tourId = button.getAttribute("tour-id");
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const indexItem = cart.findIndex(item => item.tourId == tourId);
          if(indexItem > -1){
            cart.splice(indexItem, 1); // Xóa phần tử khỏi mảng
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart(); // Vẽ lại giỏ hàng
            updateMiniCart(); // Cập nhật lại số lượng trên mini cart
          }
        })
      })

      // Bắt sự kiện check item
      const listCheckBox = boxCart.querySelectorAll(".inner-check");
      listCheckBox.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
          const checked = checkbox.checked;
          const tourId = checkbox.getAttribute("tour-id");
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const indexItem = cart.findIndex(item => item.tourId == tourId);
          if(indexItem > -1){
            cart[indexItem].checked = checked; // Cập nhật lại trạng thái checked của item trong giỏ hàng
            localStorage.setItem("cart", JSON.stringify(cart));
            drawCart(); // Vẽ lại giỏ hàng để cập nhật lại tổng tiền
          }
        })
      })
    }

    if(data.code == "error") {
      notyf.error(data.message);
      localStorage.setItem("cart", JSON.stringify([])); // Xóa giỏ hàng nếu có lỗi
      updateMiniCart();
    }
  });
}

// Box Cart
const boxCart = document.querySelector("[box-cart]");
if(boxCart) {
  drawCart();
}
// End Box Cart

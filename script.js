const firstName = document.querySelector("#firstName");
const firstNameErr = document.querySelector(".firstName .RequiredError");

const lastName = document.querySelector("#lastName");
const lastNameErr = document.querySelector(".lastName .RequiredError");

const emailAddress = document.querySelector("#emailAddress");
const emailAddressErr = document.querySelector(".email__group .RequiredError");
const emailAddressValidErr = document.querySelector(".validationError");

const requestTypeErr = document.querySelector(".radio__group .RequiredError");

const message = document.querySelector("#textarea");
const messageErr = document.querySelector(".message__group .RequiredError");

const checkboxConfirm = document.querySelector("#checkbox");
const checkboxConfirmErr = document.querySelector(
  ".consent__group .RequiredError"
);

const popup = document.querySelector(".success__popup"); // عنصر البوب‌آب
const submitButton = document.querySelector(".submit");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* دالتان مساعدة لإظهار/إخفاء الأخطاء وإضافة ستايل */
function showError(elErr, elInput) {
  if (elErr) elErr.style.display = "block";
  if (elInput) elInput.style.borderColor = "red";
}
function hideError(elErr, elInput) {
  if (elErr) elErr.style.display = "none";
  if (elInput) elInput.style.borderColor = "rgb(107, 105, 105)";
}

/* دالة لإظهار popup بنعومة ثم إخفائه تلقائياً */
function showSuccessPopup(timeout = 3000) {
  if (!popup) return;
  popup.style.display = "block";
  requestAnimationFrame(() => popup.classList.add("show"));
  popup.setAttribute("aria-hidden", "false");

  // مسح مؤقت سابق إن وجد
  if (popup._hideTimeout) clearTimeout(popup._hideTimeout);
  popup._hideTimeout = setTimeout(() => {
    popup.classList.remove("show");
    // بعد انتهاء الانيميشن نخفيه فعلياً لتفادي التداخل
    setTimeout(() => {
      popup.style.display = "none";
      popup.setAttribute("aria-hidden", "true");
    }, 300); // يطابق مدة الانتقال في CSS
  }, timeout);
}

/* الدالة الرئيسية: تحقق عند الضغط على الزر */
const submitByClick = (event) => {
  // التحديث في اللحظة: اختار radio المحدد الآن
  const requestType = document.querySelector(
    'input[name="requestType"]:checked'
  );
  const err = document.querySelectorAll(".error");

  let hasError = false;

  // first name
  if (!firstName.value.trim()) {
    showError(firstNameErr, firstName);
    hasError = true;
  } else {
    hideError(firstNameErr, firstName);
  }

  // last name
  if (!lastName.value.trim()) {
    showError(lastNameErr, lastName);
    hasError = true;
  } else {
    hideError(lastNameErr, lastName);
  }

  // email
  const emailVal = emailAddress.value.trim();
  if (!emailVal) {
    showError(emailAddressErr, emailAddress);
    // اخفاء رسالة صلاحية الايميل اذا كانت ظاهرة
    if (emailAddressValidErr) emailAddressValidErr.style.display = "none";
    hasError = true;
  } else if (!emailRegex.test(emailVal)) {
    // صيغة الايميل غير صحيحة
    if (emailAddressErr) emailAddressErr.style.display = "none";
    if (emailAddressValidErr) emailAddressValidErr.style.display = "block";
    emailAddress.style.borderColor = "red";
    hasError = true;
  } else {
    hideError(emailAddressErr, emailAddress);
    if (emailAddressValidErr) emailAddressValidErr.style.display = "none";
  }

  // request type (radio)
  if (!requestType) {
    if (requestTypeErr) requestTypeErr.style.display = "block";
    hasError = true;
  } else {
    if (requestTypeErr) requestTypeErr.style.display = "none";
  }

  // message
  if (!message.value.trim()) {
    showError(messageErr, message);
    hasError = true;
  } else {
    hideError(messageErr, message);
  }

  // checkbox
  if (!checkboxConfirm.checked) {
    showError(checkboxConfirmErr, checkboxConfirm);
    hasError = true;
  } else {
    hideError(checkboxConfirmErr, checkboxConfirm);
  }

  // لو في أخطاء نمنع الإرسال ونخلي البوب‌آب مخفي
  if (hasError) {
    event.preventDefault();
    popup.classList.remove("show");
    popup.style.display = "none";
    return;
  }

  // لو ما في أخطاء → نجحنا
  // هنا يمكنك إرسال الفورم فعليًا أو استدعاء fetch لإرسال البيانات
  // الآن سنعرض popup النجاح ونعيد تهيئة الحقول بعد عرض سريع
  event.preventDefault(); // إن كنت تريد منع الإرسال الفعلي لأنك تتعامل بالـ AJAX أو تعرض popup فقط
  showSuccessPopup(3000);

  // إعادة تهيئة الحقول بعد تأخير بسيط حتى يرى المستخدم popup
  setTimeout(() => {
    firstName.value = "";
    lastName.value = "";
    emailAddress.value = "";
    message.value = "";
    // إلغاء تحديد أي راديو
    const checkedRadio = document.querySelector(
      'input[name="requestType"]:checked'
    );
    if (checkedRadio) checkedRadio.checked = false;
    checkboxConfirm.checked = false;

    // إخفاء أي رسائل خطأ المتبقية إن وُجدت
    document
      .querySelectorAll(".RequiredError")
      .forEach((el) => (el.style.display = "none"));
    // إعادة ألوان الحواف إلى الوضع الطبيعي
    [firstName, lastName, emailAddress, message].forEach((inp) => {
      if (inp) inp.style.borderColor = "rgb(107, 105, 105)";
    });
  }, 500);
};

/* دعم الضغط على Enter (محاكاة زر) */
const submitByEnter = (event) => {
  if (event.key === "Enter") {
    submitButton.classList.add("hover");
    setTimeout(() => submitButton.classList.remove("hover"), 100);
    submitButton.click();
  }
};

/* الأحداث */
submitButton.addEventListener("click", submitByClick);
window.addEventListener("keydown", submitByEnter);


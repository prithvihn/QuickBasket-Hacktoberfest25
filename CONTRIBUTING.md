# Contributing to QuickBasket

Thank you for your interest in contributing to **QuickBasket**!  
This project is **beginner-friendly** and part of **Hacktoberfest**, so contributions are always welcome.

## 📌 How to Contribute

### 1. Fork the Repository
Click on the **Fork** button in the top-right corner of this repo to create your own copy.

### 2. Clone Your Fork
Clone your forked repo to your local machine:
```bash
git clone https://github.com/cu-sanjay/QuickBasket.git
````

### 3. Create a New Branch

Always create a new branch before making changes:

```bash
git checkout -b feature-branch
```

### 4. Make Your Changes

* Add new features
* Fix bugs
* Improve design (HTML, CSS)
* Enhance JavaScript functionality

### 5. Commit Your Changes

Use a clear and descriptive commit message:

```bash
git commit -m "Added coupon validation feature"
```

### 6. Push to Your Fork

```bash
git push origin feature-branch
```

### 7. Open a Pull Request (PR)

* Go to the original repo on GitHub.
* Click **New Pull Request**.
* Select your branch and submit. 🎉

## ✅ Contribution Rules

* Keep PRs **small and focused** (1 feature or fix per PR).
* Follow proper **HTML, CSS, and JavaScript formatting**.
* Do not remove or break existing functionality.
* Be respectful and helpful to other contributors.

## 💡 Good First Issues

Check out the **[Issues](../../issues)** tab for tasks labeled:

* `good first issue`
* `hacktoberfest`

These are beginner-friendly and perfect to start with.

## 🔑 Coding Style Guide

* Use **semantic HTML** (`<header>`, `<footer>`, `<section>`).
* Use **CSS classes** instead of inline styles.
* Keep JavaScript functions **modular** (avoid repeating code).
* Write **clear comments** for any complex code.

Example:

```js
// ✅ Good Example
function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## 🎯 Hacktoberfest Note

This project welcomes Hacktoberfest contributions.
Your PRs must be **meaningful** (not just fixing typos or spacing).

> Happy Coding 💻 and welcome to the **QuickBasket Community**! 🚀

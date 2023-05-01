// components/SignInModal/index.js
import SignInModalView from "./view.jsx";

const SignInModal = ({ isOpen, closeModal, checkSession }) => {
  async function handleSignIn(event) {
    event?.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        closeModal();
        checkSession();
      } else {
        throw new Error("Invalid login");
      }
    } catch (error) {
      closeModal();
      alert("Not a valid login");
    }
  }

  return (
    <SignInModalView
      isOpen={isOpen}
      closeModal={closeModal}
      handleSignIn={handleSignIn}
    />
  );
};

export default SignInModal;

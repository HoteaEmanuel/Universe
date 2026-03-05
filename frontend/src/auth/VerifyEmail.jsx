import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useVerifyEmailMutation } from "../queryAndMutation/mutations/auth-mutation";
import { useState } from "react";
import { useRef } from "react";
const VerifyEmail = () => {
  const navigate = useNavigate();
  const { isLoading, error } = useAuthStore();
  const [codeInputs, setCodeInputs] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { mutateAsync: verifyEmail, isError } = useVerifyEmailMutation();
  const [submitError, setSubmitError] = useState(undefined);
  const onSubmit = async (e) => {
    e.preventDefault();
    let code = codeInputs.join("");

    try {
      if (code.length !== 6) {
        setSubmitError("The verification code has 6 digits");
        throw new Error("The verification code has 6 digits");
      }
      await verifyEmail(code);
      console.log(isError);

      if (!isError) navigate("/login");
    } catch (error) {
      //
      console.log(error);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    console.log(index, value);
    const newCode = [...codeInputs];
    newCode[index] = value;
    console.log(newCode);
    setCodeInputs(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const code = e.clipboardData.getData("text").slice(0, 6);
    code.split("").forEach((char, index) => {
      if (index < 6) {
        inputRefs[index] = char;
        setCodeInputs((prev) => {
          const newCode = [...prev];
          newCode[index] = char;
          return newCode;
        });
      }
    });
  };
  console.log(codeInputs);
  return (
    <div className="w-screen h-full flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-4xl font-serif  pt-10 p-4 font-semibold">
        Verify your email
      </h1>
      <form
        onSubmit={(e) => onSubmit(e)}
        className=" w-1/2 p-10 mb-10 shadow flex flex-col  items-center justify-center rounded-4xl"
      >
        <label htmlFor="code" className="text font-serif p-4 text-violet-500">
          Enter the 6-digits verification code
        </label>
        {submitError && <p className="text-red-500 p-2">{submitError}</p>}
        {error && <p className="text-red-500 font-serif p-2">{error}</p>}
        <div className="grid grid-flow-col auto-cols-fr gap-4 w-full">
          {codeInputs.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`rounded-xl border outline-1 outline-violet-200 text-5xl font-semibold text-center p-4 focus:outline-violet-500 hover:scale-110 ${inputRefs.current[index] === document.activeElement ? "border-5 border-violet-500" : ""}`}
              type="text"
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              value={digit}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button className=" m-4 p-4 shadow border-black bg-linear-to-r from-violet-500 via-purple-600 to-violet-800 text-white rounded-xl hover:scale-110 hover:translate-y-1 duration-300 ease-in">
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;

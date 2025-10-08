import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import "./App.css";

const App = () => {
  // useStates
  const [passLen, setPassLen] = useState(10);
  const [passStrength, setPassStrength] = useState({level: "", className: ""});
  const [opt, setOpt] = useState(["1", "3"]);
  const [password, setPassword] = useState("");
  const [warn, setWarn] = useState("");

  // useRefs
  const rangeSlider = useRef();
  const copyBtn = useRef();

  // useMemos
  const {OPTIONS, OPTIONS_ARR, PASS_STRENGTH_LEVELS} = useMemo(() => {
    const OPTIONS = {
      0: "ZKJQWETXHAPGFDYBOSNULMRCV",
      1: "gqzvtyxwslkhnjrcbpefdaoiu",
      2: "2039485761",
      3: `<!@(#^&"*)_+[}|;:',.>?{]/`,
    };

    const OPTIONS_ARR = Object.values(OPTIONS).map((el) => [...el]);

    const PASS_STRENGTH_LEVELS = {
      default: {level: "", className: "bi-shield-slash-fill"},
      vulnerable: {level: " Vulnerable", className: "bi bi-shield-fill-x"},
      weak: {level: " Weak", className: "bi bi-shield-fill-exclamation"},
      strong: {level: " Strong", className: "bi bi-shield-fill-check"},
      unpredictable: {level: " Unpredictable", className: "bi-shield-shaded"},
    };

    return {OPTIONS, OPTIONS_ARR, PASS_STRENGTH_LEVELS};
  }, []);

  //useCallbacks
  const generatePassword = useCallback((len, choices) => {
    try {
      let [chars, password] = ["", ""];

      [...choices].forEach((el) => {
        let optProp = OPTIONS[el];
        if (optProp) {
          chars += optProp;
          password += optProp[Math.floor(Math.random() * OPTIONS[el].length)];
        }
      });

      const charLen = chars.length;
      for (let x = len - password.length; x > 0; x--) {
        password += chars[Math.floor(Math.random() * charLen)];
      }
      setPassword(password);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const passStrengthCheck = useCallback((password, len) => {
    password = [...password];
    let passStrength;

    try {
      if (len > 6 && len < 14) {
        if (opt.includes("0")) {
          if ([OPTIONS_ARR[1], OPTIONS_ARR[2], OPTIONS_ARR[3]].some((el) => el.some((e) => password.includes(e)))) passStrength = "weak";
          else passStrength = "vulnerable";
        } else if (opt.includes("1")) {
          if ([OPTIONS_ARR[0], OPTIONS_ARR[2], OPTIONS_ARR[3]].some((el) => el.some((e) => password.includes(e)))) passStrength = "weak";
          else passStrength = "vulnerable";
        } else if (opt.includes("2")) {
          if ([OPTIONS_ARR[0], OPTIONS_ARR[1], OPTIONS_ARR[3]].some((el) => el.some((e) => password.includes(e)))) passStrength = "weak";
          else passStrength = "vulnerable";
        } else if (opt.includes("3")) {
          if ([OPTIONS_ARR[0], OPTIONS_ARR[1], OPTIONS_ARR[2]].some((el) => el.some((e) => password.includes(e)))) passStrength = "weak";
          else passStrength = "vulnerable";
        }
      } else if (len > 13 && len < 25) {
        if (OPTIONS_ARR.every((el) => el.some((e) => password.includes(e))) || [OPTIONS_ARR[2], OPTIONS_ARR[3]].every((el) => el.some((e) => password.includes(e)))) passStrength = "strong";
      } else if (len > 24 && OPTIONS_ARR.every((el) => el.some((e) => password.includes(e)))) passStrength = "unpredictable";

      setPassStrength({level: PASS_STRENGTH_LEVELS[passStrength].level, className: PASS_STRENGTH_LEVELS[passStrength].className});
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const optionsHandler = useCallback(
    (e) => {
      const value = e.target.id;
      if (e.target.checked) setOpt((prev) => [...prev, value]);
      else setOpt(opt.filter((el) => el !== value));
    },
    [opt]
  );

  // useEffects
  useEffect(() => {
    if (!opt.length) {
      setPassword("");
      setWarn("Select at least one option");
    } else {
      const cleanup = clickToGenerate();
      return cleanup;
    }
  }, [opt]);

  useEffect(() => {
    passStrengthCheck(password, passLen);
    copyBtn.current.textContent = "Copy";
  }, [password]);

  //Click handler
  const clickToGenerate = () => {
    if (opt.length) {
      let count = 0;
      let t = setInterval(() => {
        generatePassword(passLen, opt);
        if (++count === 5) clearInterval(t);
      }, 50);
      return () => {
        clearInterval(t);
      };
    } else setWarn("Select at least one option");
  };

  return (
    <div className="app">
      <h1>
        <i className="bi bi-shield-shaded"></i>&nbsp;&nbsp;Password Generator
      </h1>
      <div className="display-div">
        <div className="output">
          <p>{password === "" ? warn : password}</p>
        </div>
      </div>
      <div className="pass-info">
        <p className="pass-length">Length: {passLen}</p>
        <p>
          <i className={passStrength.className}>{passStrength.level}</i>
        </p>
      </div>
      <div className="form-div">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="range-div">
            <span>4</span>
            <input type="range" name="range" id="range" min={4} max={100} ref={rangeSlider} value={passLen} onChange={() => setPassLen(rangeSlider.current.value)} />
            <span>100</span>
          </div>
          <div className="options">
            <div className="option">
              <p>Uppercase</p>
              <input type="checkbox" name="uppercase" id="0" checked={opt.includes("0") || false} onChange={optionsHandler} />
              <label htmlFor="0" className="toggle-btn"></label>
            </div>
            <div className="option">
              <p>Lowercase</p>
              <input type="checkbox" name="lowercase" id="1" checked={opt.includes("1") || false} onChange={optionsHandler} />
              <label htmlFor="1" className="toggle-btn"></label>
            </div>
            <div className="option">
              <p>Digits</p>
              <input type="checkbox" name="digits" id="2" checked={opt.includes("2") || false} onChange={optionsHandler} />
              <label htmlFor="2" className="toggle-btn"></label>
            </div>
            <div className="option">
              <p>Symbols</p>
              <input type="checkbox" name="symbols" id="3" checked={opt.includes("3") || false} onChange={optionsHandler} />
              <label htmlFor="3" className="toggle-btn"></label>
            </div>
          </div>
          <div className="buttons">
            <button type="submit" onClick={clickToGenerate}>
              <i className="bi bi-arrow-repeat"></i>&nbsp;<span className="btn-text">Generate</span>
            </button>
            <button
              type="submit"
              onClick={() => {
                if (!password.length) setWarn("Click the Generate button");
                else {
                  navigator.clipboard.writeText(password);
                  copyBtn.current.textContent = "Copied";
                }
              }}>
              <i className="bi bi-copy"></i>&nbsp;
              <span ref={copyBtn}>
                <span className="btn-text">Copy</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;

import "../style/payStyle.css";
export function FailPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className="wrapper w-100">
      <div className="flex-column align-center w-100 max-w-540">
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width="120"
          height="120"
        />
        <h2 className="title">결제를 실패했어요</h2>
        <div className="response-section w-100">
          <div className="flex justify-between">
            <span className="response-label">code</span>
            <span id="error-code" className="response-text">
              {errorCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="response-label">message</span>
            <span id="error-message" className="response-text">
              {errorMessage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

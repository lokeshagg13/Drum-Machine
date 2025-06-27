import ErrorIcon from "../icons/ErrorIcon";
import InfoIcon from "../icons/InfoIcon";
import SuccessIcon from "../icons/SuccessIcon";
import "./Notification.css";

function Notification(props) {
  const { type, message } = props;
  let divClass = "info";
  let icon = null;
  if (type === "pending") {
    divClass = "info";
    icon = <InfoIcon />;
  }
  if (type === "success") {
    divClass = "success";
    icon = <SuccessIcon />;
  }
  if (type === "error") {
    divClass = "error";
    icon = <ErrorIcon />;
  }
  return (
    <div className={`${divClass} notification`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

export default Notification;

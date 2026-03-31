"use client";

export function LookerDashboard() {
  return (
    <div className="w-full">
      <iframe
        width="100%"
        height="1050"
        src="https://lookerstudio.google.com/embed/reporting/35d63f3d-e42b-42fd-a76a-3ed8ae517601/page/kIV1C?hideheader=true&scrollbars=false"
        frameBorder="0"
        style={{ border: 0, width: "100%", height: "1050px" }}
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Admini Dashboard"
      />
    </div>
  );
}

function ActivityCard({ activityName, activityDetails }) {
  return (
    <div className="bg-slate-600 py-4 px-5 text-center">
      <p>{ activityName }</p>
      <h1 className="text-2xl">{activityDetails}</h1>
    </div>
  );
}

export default ActivityCard;
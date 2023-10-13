const SimulationDetail = ({ simulation }) => {
    return (
        <div className="simulation-detail">
            <h4>{simulation.title}</h4>
            <p>Number: {simulation.number}</p>
            <p>{simulation.createdAt}</p>
        </div>
    )
}

export default SimulationDetail;
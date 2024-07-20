const GanttChartWithRadioButtons = ({ zoomLevel, onZoomChange }) => {
    return (
        <div>
            {/* Radio button group for selecting zoom level */}
            <div>
                <input
                    type="radio"
                    id="hour"
                    value="Hour"
                    checked={zoomLevel === 'Hour'} // Check if zoom level is 'day'
                    onChange={onZoomChange} // Call onChange handler when selection changes
                />
                <label htmlFor="hour">Hour</label>
                <input
                    type="radio"
                    id="day"
                    value="Day"
                    checked={zoomLevel === 'Day'} // Check if zoom level is 'day'
                    onChange={onZoomChange} // Call onChange handler when selection changes
                />
                <label htmlFor="day">Day</label>

                <input
                    type="radio"
                    id="week"
                    value="Week"
                    checked={zoomLevel === 'Week'} // Check if zoom level is 'week'
                    onChange={onZoomChange} // Call onChange handler when selection changes
                />
                <label htmlFor="week">Week</label>

                <input
                    type="radio"
                    id="month"
                    value="Month"
                    checked={zoomLevel === 'Month'} // Check if zoom level is 'month'
                    onChange={onZoomChange} // Call onChange handler when selection changes
                />
                <label htmlFor="month">Month</label>
                <input
                    type="radio"
                    id="year"
                    value="Year"
                    checked={zoomLevel === 'Year'} // Check if zoom level is 'day'
                    onChange={onZoomChange} // Call onChange handler when selection changes
                />
                <label htmlFor="year">Year</label>
            </div>
            {/* Add other content related to the Gantt chart */}
        </div>
    );
};

export default GanttChartWithRadioButtons;

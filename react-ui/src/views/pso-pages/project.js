import React from 'react';
import { useParams } from 'react-router-dom';
import GanttProject from '../pso-pages/new-project';

const EditProject = () => {
    const { projectId } = useParams();

    return (
        <div>
            <GanttProject projectId={projectId} />
        </div>
    );
};

export default EditProject;

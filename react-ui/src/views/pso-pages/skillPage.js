import React, { useState, useEffect } from 'react';
import SkillTable from './skill-list';
import SkillForm from './new-skill';
import axios from 'axios';

const SkillPage = () => {
    const [skills, setSkills] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-skills');
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const addSkill = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/add-skill', formData);
            const newSkill = response.data;
            setSkills((prevSkills) => [...prevSkills, newSkill]);
            setShowModal(false); // Close the modal after adding the skill
        } catch (error) {
            console.error('Error adding skill:', error);
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <SkillTable skills={skills} openModal={openModal} />
            {showModal && <SkillForm addSkill={addSkill} closeModal={closeModal} />}
        </div>
    );
};

export default SkillPage;

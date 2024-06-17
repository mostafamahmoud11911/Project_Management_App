import React from 'react';
import DarkModeToggle from "react-dark-mode-toggle";
import { useState, useEffect } from "react";

export default function DarkMood() {
    let [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div>
            <DarkModeToggle
                className="darkModeToggle"
                onChange={setIsDarkMode}
                checked={isDarkMode}
                size={50}
            />
        </div>
    );
}
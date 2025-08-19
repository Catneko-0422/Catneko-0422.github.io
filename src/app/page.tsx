"use client";

import ProfileHeader from "@/components/home/ProfileHeader";
import FloatingToolsWidget from "@/components/home/FloatingToolsWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <>
            <ProfileHeader />
            <FloatingToolsWidget
                align="left"
                icon={<FontAwesomeIcon icon={faCat} className="w-5 h-5" />}
                iconOpen={<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />}
            />
        </>
    );
}
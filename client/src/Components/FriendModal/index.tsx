import React from "react";
import PropTypes from "prop-types";
import "./style.css";

function FriendModal({
    username,
    onClose,
}: {
    username: string;
    onClose: () => void;
}) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="user-section">
                    <div
                        className="user-avatar"
                        style={{ backgroundImage: `url(path_to_user_avatar)` }}
                    ></div>
                    <div className="user-name">{username}</div>
                </div>

                <div className="favorite-movie">
                    <div
                        className="arrow left"
                        // onClick={/* functionality to slide left */}
                    >
                        &lt;&lt;
                    </div>

                    <div
                        className="movie-image"
                        // style={{
                        //     backgroundImage: `url(${favoriteMovieImage})`,
                        // }}
                    ></div>

                    <div
                        className="arrow right"
                        // onClick={/* functionality to slide right */}
                    >
                        &gt;&gt;
                    </div>

                    <div className="indicators">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

FriendModal.propTypes = {
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FriendModal;

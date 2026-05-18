import './module.css';

export const AboutUsPage = () => {
    return (
        <div className="about-us-page">
            <div className="about-us-container">
                <section className="about-hero">
                    <h1>About Application</h1>
                    <p className="about-tagline">
                        STAR TREK Heroes Search - convenient search for characters of the universe Star Trek
                    </p>
                </section>

                <section className="about-description">
                    <h2>About the App</h2>
                    <p>
                        This application allows you to search for characters from the Star Trek universe 
                        using the STAPI (Star Trek API). You can browse through characters, search by name, 
                        and view detailed information about each character including their species, 
                        organizations, and status.
                    </p>
                    <p>
                        The app features real-time search, pagination, and saves your last search query 
                        for convenience.
                    </p>
                </section>

                <section className="about-author">
                    <h2>About the Author</h2>
                    <div className="author-info">
                        <div className="author-details">
                            <h3>Developer</h3>
                            <p>
                                This application was developed as a learning project to demonstrate 
                                modern React development practices including:
                            </p>
                            <ul>
                                <li>React with TypeScript</li>
                                <li>Functional components with Hooks</li>
                                <li>React Router for navigation</li>
                                <li>Custom hooks for pagination</li>
                                <li>Local storage for persistence</li>
                                <li>Comprehensive testing with Vitest</li>
                            </ul>
                            <div className="author-links">
                                <a 
                                    href="https://github.com/rockabil" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="author-link"
                                >
                                    GitHub Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-rs-school">
                    <h2>RS School React Course</h2>
                    <div className="rs-school-content">
                        <p>
                            This project was created as part of the <strong>RS School React Course</strong>, 
                            a free community-based educational program run by The Rolling Scopes developer 
                            community since 2013.
                        </p>
                        <p>
                            The course provides intensive training in React development with a focus on 
                            practical, real-world skills. Students learn modern React concepts including 
                            hooks, context, routing, state management, and testing.
                        </p>
                        <a 
                            href="https://rs.school/courses/reactjs" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rs-school-button"
                        >
                            Learn more about RS School React Course
                            <span className="button-arrow">→</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};
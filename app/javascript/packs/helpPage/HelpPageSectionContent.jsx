import React from "react";
import HelpPageSteps from "./HelpPageSteps";
import PropTypes from "prop-types";

const create_new_account_steps = [
    {
        name: "Click on the 'Create New Account' button",
        image: "assets/help24-e672eed2457ea09822df541fd28d7183852a2f8200413e25324e24ebdf200604.png"
    },
    {
        name: "Fill out the form and submit",
        image: "assets/help23-caf5dd293420862710c44139708d0112fe27ae59f8c94814f30e4b6852f6ce82.png"
    }
]

const update_existing_account_steps = [
    {
        name: "Click on the account that you wish to update",
        image: "assets/help21-82f866d3bef780adc48036a9ba25fec6ea0854a15c85ab339d3036ce34e9ef33.png"
    },
    {
        name: "Update the form with new information and submit",
        image: "assets/help22-110f7c96c49701bfeab1837c5a9e4ba7a3f4a083bf4381f20313c03ccb4c6698.png"
    }
]

const delete_account_steps = [
    {
        name: "Click on the account that you wish to delete",
        image: "assets/help21-82f866d3bef780adc48036a9ba25fec6ea0854a15c85ab339d3036ce34e9ef33.png"
    },
    {
        name: "Click on the 'Delete Account' button",
        image: "assets/help22-110f7c96c49701bfeab1837c5a9e4ba7a3f4a083bf4381f20313c03ccb4c6698.png"
    }
]

const create_parade_steps = [
    {
        name: "Click on the 'Add' button",
        image: "assets/help2-1f23b3a37e2d40c6d8ba8058161c0e2b6b2df2b94f2531ae4061c61f519e450c.png"
    },
    {
        name: "Fill out the form",
        image: "assets/help1-f7d236e8a1bc25f207a04f54820763c459884ba3b17f9afa61cec466d6c51dc0.png"
    },
    {
        name: "Click on the 'Create Parade' button",
        image: "assets/help4-b46121088d60316f2fc7eca898eb7d88311b4467afa256a59ca460e409258bc6.png"
    },
    {
        name: "Parade created successfully",
        image: "assets/help3-34b1fec3bdf9715ccd78bef169012b6855a30a3ebd2d9c85b39c9642fa53a348.png"
    }
]

const view_existing_parade_steps = [
    {
        name: "Select the year that the parade took place",
        image: "assets/help7-41f95a6c4655c7496f0ab14a8da24fa3e07865d91c9640c0b9852176509c97d2.png"
    },
    {
        name: "Click on the parade that you wish to view",
        image: "assets/help6-6e4caf3bbe8452585039605f90a328e699ac9b7fb6bec62e898ff436294f221a.png"
    },
    {
        name: "Parade Notice in PDF would be displayed",
        image: "assets/help5-273dd37ef0726fe24824149d4238d9fb5f193a12ebce961aac8ff744ca3f7d51.png"
    }
]

const edit_existing_parade_steps = [
    {
        name: "Click on the year that the parade took place",
        image: "assets/help7-41f95a6c4655c7496f0ab14a8da24fa3e07865d91c9640c0b9852176509c97d2.png"
    },
    {
        name: "Select the parade that you wish to update",
        image: "assets/help6-6e4caf3bbe8452585039605f90a328e699ac9b7fb6bec62e898ff436294f221a.png"
    },
    {
        name: "Click on 'Edit Parade Notice'",
        image: "assets/help5-273dd37ef0726fe24824149d4238d9fb5f193a12ebce961aac8ff744ca3f7d51.png"
    },
    {
        name: "Update the form with new information and submit",
        image: "assets/help8-52fc000e8300e846aaeb299f82b1a03236f52e8b4addfdd81885536889e24cc3.png"
    }
]

const delete_parade_steps = [
    {
        name: "Click on the year that the parade took place",
        image: "assets/help7-41f95a6c4655c7496f0ab14a8da24fa3e07865d91c9640c0b9852176509c97d2.png"
    },
    {
        name: "Select the parade that you wish to delete",
        image: "assets/help6-6e4caf3bbe8452585039605f90a328e699ac9b7fb6bec62e898ff436294f221a.png"
    },
    {
        name: "Click on the 'Edit Parade Notice' button",
        image: "assets/help5-273dd37ef0726fe24824149d4238d9fb5f193a12ebce961aac8ff744ca3f7d51.png"
    },
    {
        name: "Click on the 'Delete Parade Notice' button",
        image: "assets/help9-f08d41ae17ad71ef4f8ada8bd515d8bc72166d20e5ef8fca36f183586b55a217.png"
    },
    {
        name: "Parade Notice deleted successfully",
        image: "assets/help10-5dcaed70867ed2b03cbc7f410558fc843af01347e19fce42b967f8763d6a4b7a.png"
    }
]

const generate_32a_results_steps = [
    {
        name: "Select an award",
        image: "assets/help13-a6f6081c11fbf2dff2927dcf249824b0bd2e90b2162e5d54717344b14a3535fa.png"
    },
    {
        name: "Select an instructor",
        image: "assets/help12-f0bc52ffa4f4aa92983b732e4658c3ebb4d0812de77c5091562e880a98f81ce5.png"
    },
    {
        name: "Select the boys who passed the award",
        image: "assets/help11-47e8aebf42e784865ea1c91cb8f29fd8c553f3c793418d475aa4165187ef38b8.png"
    },
    {
        name: "Certain awards may require you to fill in additional information",
        image: "assets/help14-b86d95902133d2ed156e2ba2759e18e71fc20b47a87ea33447f06ee6ace3249d.png"
    },
    {
        name: "Click on the 'Generate Results' button",
        image: "assets/help11-47e8aebf42e784865ea1c91cb8f29fd8c553f3c793418d475aa4165187ef38b8.png"
    },
    {
        name: "32A results in PDF would be displayed",
        image: "assets/help15-01b6c79780edf59e70a070bfe1c0035ab3c80bcabb43a0d267e06a88968789be.png"
    }
]

const conducting_inspection_steps = [
    {
        name: "Click on the 'Conduct Inspection' button",
        image: "assets/help17-68c1c5673889a4d30066ddc7c0faa1c927d4cd5be2d1a6e96ec9e2fa833075ca.png"
    },
    {
        name: "Select the boys that you wish to inspect",
        image: "assets/help20-9bb7935049e5c76054621bea040133ab3651d88e641ffa060ffde1138088c021.png"
    },
    {
        name: "Check the boxes when the boy has fulfilled the listed criteria",
        image: "assets/help18-53de74f8e0c6714e0f2fee40df1fc33b47d6f6c739714d56ec510d4894112131.png"
    },
    {
        name: "After finish the boy's inspection, use the drop down to switch to the next boy",
        image: "assets/help19-3409f6b8233452be34240ee786692bf65393aebb28f2ac510a10bc63b476832e.png"
    },
    {
        name: "Only when all boys have been inspected, click on the 'Finish Inspection' button",
        image: "assets/help16-0c3f2530a5c79e64129047e4e88f5a5602f6c81ac7b43a5636b57a4518a25e45.png"
    }
]

function HelpPageSectionContent({ accountType, appointment }) {
    return (
        <div className="help-page-section-content">
            <section className="help-page-section">
                <h2>Overview</h2>
                
                <h3 id="website-purpose">Website&apos;s purpose</h3>
                <p>BB 21<sup>st</sup> Portal is a website designed for Officers, Primers and Boys to facilitate administrative workflow</p>

                <h3 id="features">Features</h3>
                <p>BB 21<sup>st</sup> Portal currently supports the following features:</p>
                <ul>
                    <li>Provides an overview of all members, including Officers, Primers, current and graduated boys</li>
                    <li>Creating and updating Parade Notices</li>
                    <li>Keeping track of Parade Attendance</li>
                    <li>Keeping track of Boys&apos; Awards</li>
                    <li>Providing a description and guide to complete awards from the company&apos;s perspective</li>
                    <li>Generating 32A results in PDF format through a simplified form</li>
                    <li>Conducting Uniform Inspections based on a list of criterias</li>
                    <li>Allowing Boys to see their attained awards</li>
                </ul>
                <p><strong>In this help page, you would only be able to see the guide to pages that you have access to</strong></p>
            </section>

            <section>
                <h2>Home Page</h2>

                <h3 id="routes">Routes</h3>
                <p>Home Page contains the following routes depending on the account type:</p>
                <div className="help-page-table">
                    <p></p>
                    <p>Boy (w/o appt)</p>
                    <p>Boy (w/ appt)</p>
                    <p>Primer</p>
                    <p>Officer</p>

                    <p>Boy&apos;s Awards</p>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-xmark"></i></div>

                    <p>User Management</p>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Awards Management</p>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Results Generation</p>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Uniform Inspection</p>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-xmark"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Parade &amp; Attendance</p>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Reset Login Infomation</p>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>

                    <p>Log out</p>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                    <div><i className="fa-solid fa-check"></i></div>
                </div>

                <p><strong>Note that certain account types may have more privileges compared to others even if a page is accessible to multiple account types</strong></p>
            
                <h3 id="pending-tasks">Pending Tasks</h3>
                <p>Home Page displays the following pending tasks (if any):</p>
                <ul>
                    <li><strong>Upcoming Parade Notice:</strong> There is an upcoming Parade on DD MM YYYY</li>
                    <li><strong>Role in upcoming Parade:</strong> You are the <i>COS</i> for the DD MM YYYY Parade</li>
                </ul>

                <p>If no pending tasks are found, a message will be displayed stating &quot;No Pending Tasks&quot;</p>
            </section>

            {(accountType !== "Boy" || appointment) && <section>
                <h2>User Management</h2>

                <h3 id="create-new-account">Create new account</h3>
                <div>
                    <HelpPageSteps steps={create_new_account_steps} />
                </div>

                <h3 id="update-existing-account">Update existing account</h3>
                <div>
                    <HelpPageSteps steps={update_existing_account_steps} />
                </div>

                <h3 id="delete-existing-account">Delete existing account</h3>
                <div>
                    <HelpPageSteps steps={delete_account_steps} />
                </div>
            </section>}

            <section>
                <h2>Parade &amp; Attendance</h2>

                {(accountType !== "Boy" || appointment) && <>
                <h3 id="create-parade">Creating a parade</h3>
                <div>
                    <HelpPageSteps steps={create_parade_steps} />
                </div>
                </>}

                <h3 id="view-existing-parade">Viewing existing parade</h3>
                <div>
                    <HelpPageSteps steps={view_existing_parade_steps} />
                </div>
            
                {(accountType !== "Boy" || appointment) && <>
                <h3 id="edit-existing-parade">Edit existing parade</h3>
                <div>
                    <HelpPageSteps steps={edit_existing_parade_steps} />
                </div>
                <p><strong>Note that the editing of a parade is only accessible by Officers, Primers, and Boys (with appointment) account types</strong></p>
                <p><strong>The editing of a parade must be done before finalisation</strong></p>
                
                <h3>Delete existing parade</h3>
                <div>
                    <HelpPageSteps steps={delete_parade_steps} />
                </div>
                </>}

                <h3 id="download-attendance-file">Download attendance file</h3>
                <ol>
                    <li>Select the year that you wish to download the attendance file</li>
                    <li>Click the &quot;Attendance&quot; button</li>
                    <li>The attendance file will be downloaded</li>
                </ol>
                <p><strong>Note that the attendance file is only available from 2025 onwards</strong></p>

                <h3 id="update-parade-attendance">Update parade attendance</h3>
                <ol>
                    <li>Click the parade that you wish to update</li>
                    <li>Scroll down until you see the Parade Attendance section</li>
                    <li>Find the boy that you wish to update</li>
                    <li>Click the current attendance and select the new attendance</li>
                    <li>Your selection will be updated automatically</li>
                </ol>
            </section>

            
            {(accountType !== "Boy" || appointment) && <>
            <section>
                <h2>Awards Management</h2>

                <h3 id="updating-awards-tracker">Updating awards tracker</h3>
                <ol>
                    <li>Click the &quot;Awards Tracker&quot; button at the top</li>
                    <li>Find the table that you wish to update (Electives, IPA, etc)</li>
                    <li>Find the boy(s) that you wish to update (rows)</li>
                    <li>Find the award that you wish to update (columns)</li>
                    <li>Click the checkbox that corresponds to the selected boy and award</li>
                    <li>Your selection will be updated automatically</li>
                </ol>

                <h3 id="award-requirements">Award Requirements</h3>
                <ol>
                    <li>Click the &quot;Award Requirements&quot; button at the top</li>
                    <li>Find and click the award that you wish to view</li>
                </ol>

                <p>For Awards <strong>with</strong> Masteries</p>
                <ul>
                    <li>You may see multiple masteries</li>
                    <li>A description from the company&apos;s perspective will be displayed per mastery</li>
                    <li>The recommended secondary level for the completion of the mastery is displayed at the top right of every mastery</li>
                    <li>Clicking the book icon (found at the right of the award name) would redirect you to the BBSP Notion for that award, where you may learn more about the award</li>
                </ul>

                <p>For Awards <strong>without</strong> Masteries</p>
                <ul>
                    <li>You may only see one description</li>
                    <li>The recommended secondary level for the completion of the award is displayed at the top right of the description</li>
                    <li>Clicking the book icon (found at the right of the award name) would redirect you to the BBSP Notion for that award, where you may learn more about the award</li>
                </ul>
            </section>

            <section>
                <h2>Results Generation</h2>

                <h3 id="generate-32a-results">Generating 32A results</h3>
                <div>
                    <HelpPageSteps steps={generate_32a_results_steps} />
                </div>
            </section>
            </>}

            {accountType !== "Boy" && <section>
                <h2>Uniform Inspection</h2>

                <h3 id="viewing-inspection-results">Viewing inspection results</h3>
                <ul>
                    <li>You should be able to see a table of the most recent inspection</li>
                    <li>Click the icon for the boy that you wish to view the inspection</li>
                    <li>You will be redirected to the inspection page for that boy</li>
                    <li>Fields highlighted in green indicate that the boy has fulfilled the listed criteria</li>
                </ul>

                <h3 id="conducting-inspection">Conducting inspection</h3>
                <div>
                    <HelpPageSteps steps={conducting_inspection_steps} />
                </div>
                <p><strong>Only click the &quot;Finish Inspection&quot; button after you have completed the inspection for all boys</strong></p>
                <p>The Boys do not share the same form, you have to swap between the Boys when filling up the form</p>
                <p>You may switch between Boys at any point of the inspection. Swapping to another Boy will not remove the form filled out for the previous Boys.</p>
            </section>}

            {accountType === "Boy" && <section>
                <h2>Boys&apos; Awards</h2>

                <h3 id="viewing-boys-awards">Viewing Boys&apos; Awards</h3>
                <ul>
                    <li>You should be able to see a list of all awards along with their image</li>
                    <li>Each mastery available for that award is also shown</li>
                    <li>For each mastery, a status in a form of an icon will be displayed</li>
                    <li>A red &quot;X&quot; icon indicates that you have not yet achieved the award</li>
                    <li>A green checkmark indicates that you have achieved the award</li>
                    <li>For awards that do not have masteries, a &quot;-&quot; would be displayed in place of a mastery level</li>
                </ul>
            </section>}

            {accountType === "Admin" && <section>
                <h2>Developer</h2>

                <h3 id='#developer'>Developer Guide</h3>
                <a href='https://github.com/BryanL2303/BB-21st-Portal/blob/ui/ux-redesign/docs/DeveloperGuide.md'>Click here to see the developer guide</>
            </section>}
        </div>
    );
}

HelpPageSectionContent.propTypes = {
    accountType: PropTypes.string,
    appointment: PropTypes.string
};

export default HelpPageSectionContent

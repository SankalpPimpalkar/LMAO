'use client';

export default function Home() {
  return (
    <div className='p-10 space-x-4 space-y-5'>
      <input type="text" className='input' />
      <button className='btn'>
        Button
      </button>

      <div className="breadcrumbs text-sm">
        <ul>
          <li><a>Home</a></li>
          <li><a>Documents</a></li>
          <li>Add Document</li>
        </ul>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Page title</legend>
        <input type="text" className="input" placeholder="My awesome page" />
        <p className="label">You can edit page title later on from settings</p>
      </fieldset>

      <span className="loading loading-bars loading-xl"></span>

      <button className="btn" onClick={() => (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal()}>open modal</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <progress className="progress progress-primary w-56" value="60" max="100"></progress>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Page Views</div>
          <div className="stat-value">12,345</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>

      <span className="flex">
        Providing AI Agents for
        <span className="text-rotate pl-2">
          <span>
            <span className="bg-teal-400 text-teal-800 px-2">Designers</span>
            <span className="bg-red-400 text-red-800 px-2">Developers</span>
            <span className="bg-blue-400 text-blue-800 px-2">Managers</span>
          </span>
        </span>
      </span>

      <input type="checkbox" defaultChecked className="toggle" />
    </div>
  )
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

const DEFAULT_CONTENT = `
<header class="brandbar"><span class="brand-mark">ADVATAR<em>.</em></span></header>

<section class="hero-showcase">
  <span class="industry-badge" data-editable="true">Food and GAY</span>
  <h1 class="headline" data-editable="true">Marketing Done Right.</h1>
  <p class="subhead" data-editable="true">Strategic, high-level content for over 40 clients — generating millions of views, driving revenue, and elevating engagement, awareness, credibility and brand perception.</p>
</section>

<section>
  <div class="section-head">
    <span class="tag" data-editable="true">The Work</span>
    <h2 data-editable="true">Videos &amp; Photos</h2>
  </div>

  <div class="media-grid" id="mediaGrid">
    <div class="media-block">
      <button class="media-remove" type="button" title="Remove">&times;</button>
      <h4 class="media-title" data-editable="true">Project Title</h4>
      <div class="media-upload">
        <div class="media-trigger"><span class="media-placeholder">+<br>Upload video or photo</span></div>
        <video controls playsinline></video>
        <img alt="" />
        <button class="media-replace" type="button">Replace</button>
        <input type="file" accept="video/*,image/*" />
      </div>
      <p class="media-caption" data-editable="true">Add a short caption describing this project.</p>
    </div>

    <div class="media-block">
      <button class="media-remove" type="button" title="Remove">&times;</button>
      <h4 class="media-title" data-editable="true">Project Title</h4>
      <div class="media-upload">
        <div class="media-trigger"><span class="media-placeholder">+<br>Upload video or photo</span></div>
        <video controls playsinline></video>
        <img alt="" />
        <button class="media-replace" type="button">Replace</button>
        <input type="file" accept="video/*,image/*" />
      </div>
      <p class="media-caption" data-editable="true">Add a short caption describing this project.</p>
    </div>
  </div>

  <button class="add-media-btn" id="addMediaBtn" type="button">+ Add video or photo</button>
</section>

<section>
  <div class="section-head">
    <span class="tag" data-editable="true">Proof</span>
    <h2 data-editable="true">Results</h2>
  </div>

  <div class="results-grid" id="resultsGrid">
    <div class="result-card">
      <button class="result-remove" type="button" title="Remove">&times;</button>
      <span class="result-stat" data-editable="true">2.3M</span>
      <span class="result-label" data-editable="true">Views generated</span>
      <p class="result-desc" data-editable="true">Short line on the client and what was delivered — the brief, the approach, the outcome.</p>
    </div>
    <div class="result-card">
      <button class="result-remove" type="button" title="Remove">&times;</button>
      <span class="result-stat" data-editable="true">+140%</span>
      <span class="result-label" data-editable="true">Engagement lift</span>
      <p class="result-desc" data-editable="true">Short line on the client and what was delivered — the brief, the approach, the outcome.</p>
    </div>
    <div class="result-card">
      <button class="result-remove" type="button" title="Remove">&times;</button>
      <span class="result-stat" data-editable="true">40+</span>
      <span class="result-label" data-editable="true">Clients served</span>
      <p class="result-desc" data-editable="true">Short line on the client and what was delivered — the brief, the approach, the outcome.</p>
    </div>
  </div>

  <button class="add-result-btn" id="addResultBtn" type="button">+ Add result</button>
</section>

<div class="cta-band">
  <div class="cta-inner">
    <p class="cta-text" data-editable="true">We'll create this content for you.</p>
    <p class="cta-sub" data-editable="true">"Ready by Monday"</p>
  </div>
</div>

<footer>ADVATAR — CLIENT SHOWCASE</footer>
`;

export default function Page() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('Loading…');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const wiredRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        containerRef.current.innerHTML = (data && data.html) || DEFAULT_CONTENT;
        setStatus('');
        wireUp();
      })
      .catch(() => {
        if (cancelled) return;
        containerRef.current.innerHTML = DEFAULT_CONTENT;
        setStatus('');
        wireUp();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode);
    if (containerRef.current) {
      containerRef.current
        .querySelectorAll('[data-editable="true"]')
        .forEach((el) => el.setAttribute('contenteditable', editMode ? 'true' : 'false'));
    }
  }, [editMode]);

  function wireMediaUpload(uploadBox) {
    const input = uploadBox.querySelector('input[type="file"]');
    const trigger = uploadBox.querySelector('.media-trigger');
    const replaceBtn = uploadBox.querySelector('.media-replace');
    const video = uploadBox.querySelector('video');
    const img = uploadBox.querySelector('img');

    const openPicker = () => {
      if (!document.body.classList.contains('edit-mode')) return;
      input.click();
    };
    trigger.addEventListener('click', openPicker);
    replaceBtn.addEventListener('click', openPicker);

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type.startsWith('video/')) {
        img.removeAttribute('src');
        video._sourceFile = file;
        video.src = URL.createObjectURL(file);
        video.load();
        video.onloadedmetadata = () => {
          if (video.videoWidth && video.videoHeight) {
            uploadBox.style.aspectRatio = video.videoWidth / video.videoHeight;
          }
        };
      } else {
        video.removeAttribute('src');
        video._sourceFile = null;
        video.load();
        img._sourceFile = file;
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.naturalWidth && img.naturalHeight) {
            uploadBox.style.aspectRatio = img.naturalWidth / img.naturalHeight;
          }
        };
      }
      uploadBox.classList.add('has-media');
      input.value = '';
    });
  }

  function wireUp() {
    if (wiredRef.current) return;
    wiredRef.current = true;
    const root = containerRef.current;

    root.querySelectorAll('.media-upload').forEach(wireMediaUpload);

    root.querySelector('#mediaGrid').addEventListener('click', (e) => {
      if (e.target.classList.contains('media-remove')) {
        e.target.closest('.media-block').remove();
      }
    });

    root.querySelector('#addMediaBtn').addEventListener('click', () => {
      const block = document.createElement('div');
      block.className = 'media-block';
      block.innerHTML = `
        <button class="media-remove" type="button" title="Remove">&times;</button>
        <h4 class="media-title" contenteditable="true">Project Title</h4>
        <div class="media-upload">
          <div class="media-trigger"><span class="media-placeholder">+<br>Upload video or photo</span></div>
          <video controls playsinline></video>
          <img alt="">
          <button class="media-replace" type="button">Replace</button>
          <input type="file" accept="video/*,image/*">
        </div>
        <p class="media-caption" contenteditable="true">Add a short caption describing this project.</p>
      `;
      root.querySelector('#mediaGrid').appendChild(block);
      wireMediaUpload(block.querySelector('.media-upload'));
      block.querySelector('.media-title').focus();
    });

    root.querySelector('#resultsGrid').addEventListener('click', (e) => {
      if (e.target.classList.contains('result-remove')) {
        e.target.closest('.result-card').remove();
      }
    });

    root.querySelector('#addResultBtn').addEventListener('click', () => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <button class="result-remove" type="button" title="Remove">&times;</button>
        <span class="result-stat" contenteditable="true">0%</span>
        <span class="result-label" contenteditable="true">Result label</span>
        <p class="result-desc" contenteditable="true">Short line on the client and what was delivered.</p>
      `;
      root.querySelector('#resultsGrid').appendChild(card);
      card.querySelector('.result-stat').focus();
    });
  }

  function getPassword() {
    let pw = sessionStorage.getItem('editPassword');
    if (!pw) {
      pw = window.prompt('Enter the edit password for this page:') || '';
      if (pw) sessionStorage.setItem('editPassword', pw);
    }
    return pw;
  }

  function handleEditToggle() {
    if (editMode) {
      setEditMode(false);
      return;
    }
    const pw = getPassword();
    if (!pw) return;
    setEditMode(true);
    setStatus('Editing — click any text to change it');
  }

  async function uploadFile(file, password) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `media/${Date.now()}-${safeName}`;
    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      clientPayload: JSON.stringify({ password }),
    });
    return blob.url;
  }

  async function handleSave() {
    const pw = getPassword();
    if (!pw) return;
    setSaving(true);
    setStatus('Saving…');
    try {
      const root = containerRef.current;
      const mediaEls = root.querySelectorAll('.media-upload video, .media-upload img');
      for (const el of mediaEls) {
        if (el._sourceFile) {
          setStatus('Uploading media…');
          try {
            const url = await uploadFile(el._sourceFile, pw);
            el.src = url;
            el._sourceFile = null;
          } catch (err) {
            const msg = String((err && err.message) || err).toLowerCase();
            if (msg.includes('unauthorized')) {
              sessionStorage.removeItem('editPassword');
              setStatus('Wrong password — try Save again');
              setSaving(false);
              return;
            }
            throw err;
          }
        }
      }

      // strip contenteditable attributes and any leftover editing affordances before saving
      const clone = root.cloneNode(true);
      clone.querySelectorAll('[contenteditable]').forEach((el) => el.removeAttribute('contenteditable'));

      setStatus('Saving page…');
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-edit-password': pw },
        body: JSON.stringify({ html: clone.innerHTML }),
      });
      if (res.status === 401) {
        sessionStorage.removeItem('editPassword');
        setStatus('Wrong password — try Save again');
        setSaving(false);
        return;
      }
      if (!res.ok) {
        let msg = 'save failed';
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch {
          // response wasn't JSON — keep the generic message
        }
        throw new Error(msg);
      }
      setStatus('Saved — live for everyone');
    } catch (err) {
      const msg = (err && err.message) || 'unknown error';
      setStatus(`Error: ${msg}`);
      console.error('Save failed:', err);
    }
    setSaving(false);
  }

  return (
    <>
      <div ref={containerRef} />

      <div className="toolbar">
        <span className="status">{status}</span>
        <button className="secondary" type="button" onClick={() => window.print()}>
          Print / PDF
        </button>
        <button className="secondary" type="button" onClick={handleEditToggle}>
          {editMode ? 'Stop editing' : 'Edit'}
        </button>
        {editMode && (
          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save to website'}
          </button>
        )}
      </div>
    </>
  );
}

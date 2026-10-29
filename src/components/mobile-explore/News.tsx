"use client";

import { useRef, useState } from "react";
import { destination, slides } from "./data";
import { Media } from "./Media";
import styles from "./mobile-explore.module.css";

export function News() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  return <section className={styles.news} aria-label="News" aria-roledescription="carousel">
    <div className={styles.newsTrack} ref={track} onScroll={() => {
      if (track.current?.clientWidth) setActive(Math.round(track.current.scrollLeft / (track.current.clientWidth + 12)));
    }}>
      {slides.map((slide, i) => <a key={slide.title} href={destination(slide.href || "/signup")} className={styles.newsSlide} aria-label={`Open ${slide.title}`}>
        <figure>
          <Media video={slide.video} image={"poster" in slide ? slide.poster : undefined} label={`${slide.title} - ${slide.description}`} enabled={active === i} />
          {"discount" in slide ? <div className={styles.discountCopy}>
            <h3>Sign up and get your<br /><em>extra discount</em></h3>
            <ul><li>✓ Get unlimited Nano Banana Pro</li><li>✓ Unlock your extra discount</li><li>✓ Access to Seedance 2.5</li></ul>
            <span>Sign up and get your discount</span>
          </div> : <figcaption><h3>{slide.title}</h3><p>{slide.description}</p></figcaption>}
        </figure>
      </a>)}
    </div>
    <div className={styles.dots} aria-label="Choose news slide">
      {slides.map((slide, i) => <button key={slide.title} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={active === i} onClick={() => track.current?.scrollTo({ left: i * (track.current.clientWidth + 12), behavior: "smooth" })} />)}
    </div>
  </section>;
}

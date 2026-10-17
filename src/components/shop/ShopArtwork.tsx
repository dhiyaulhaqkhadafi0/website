import { ProductImage } from "@/components/commerce/ProductImage";
import type { ShopItem } from "@/content/shop";
import s from "./shop.module.css";
export function ShopArtwork({
  item,
  priority = false,
}: {
  item: Pick<ShopItem, "artwork" | "title" | "cover">;
  priority?: boolean;
}) {
  if (item.artwork === "book")
    return (
      <div className={`${s.artwork} ${s.bookArt}`}>
        <div className={`${s.book} ${item.cover?.includes("mockup") ? s.mockupBook : ""}`}>
          {item.cover ? (
            <ProductImage src={item.cover} alt={item.title} eager={priority} />
          ) : (
            <div className={s.textCover}>
              <small>KHADAFI / DIGITAL EDITION</small>
              <strong>{item.title}</strong>
              <span>Ideas into practice.</span>
            </div>
          )}
        </div>
      </div>
    );
  return (
    <div className={`${s.artwork} ${s[item.artwork]}`} aria-hidden="true">
      <span className={s.artCaption}>
        STUDIO STUDIES /{" "}
        {item.artwork === "web" ||
        item.artwork === "prototype" ||
        item.artwork === "strategy"
          ? "SERVICES"
          : "TOOLS"}
      </span>
      {item.artwork === "chatgpt" ? (
        <>
          <div className={s.ideaOrbit}>
            <span>?</span>
            <i />
            <i />
            <i />
          </div>
          <strong className={s.artWord}>
            A little context.
            <br />
            <em>A new perspective.</em>
          </strong>
        </>
      ) : item.artwork === "figma" ? (
        <>
          <div className={s.shapeStudy}>
            <i />
            <i />
            <i />
            <i />
          </div>
          <strong className={s.artWord}>
            Give ideas
            <br />
            <em>a little shape.</em>
          </strong>
        </>
      ) : item.artwork === "notion" ? (
        <>
          <div className={s.paperStack}>
            <i />
            <i />
            <div>
              <small>NOTES TO SELF</small>
              <strong>
                Less scattered.
                <br />
                More intentional.
              </strong>
              <span>01 — A place to begin</span>
              <span>02 — Room to grow</span>
            </div>
          </div>
        </>
      ) : item.artwork === "vercel" ? (
        <>
          <div className={s.launchStudy}>
            <i />
            <span>LOCAL → LIVE</span>
          </div>
          <strong className={s.artWord}>
            Make it real.
            <br />
            <em>Let it meet the world.</em>
          </strong>
        </>
      ) : item.artwork === "web" ? (
        <>
          <div className={s.windowStudy}>
            <span />
            <div>
              <i />
              <i />
              <i />
            </div>
            <strong>
              Hello,
              <br />
              <em>possibility.</em>
            </strong>
            <b>YOUR NEXT CHAPTER ↗</b>
          </div>
        </>
      ) : item.artwork === "prototype" ? (
        <>
          <div className={s.flowStudy}>
            <span>IDEA</span>
            <i />
            <span>PROTOTYPE</span>
            <i />
            <span>LEARN ↗</span>
          </div>
          <strong className={s.artWord}>
            Small steps.
            <br />
            <em>Something tangible.</em>
          </strong>
        </>
      ) : (
        <>
          <div className={s.strategyStudy}>
            <span>THE MESSAGE</span>
            <strong>
              Make
              <br />
              <em>it matter.</em>
            </strong>
            <i />
            <small>CLARITY BEFORE VOLUME</small>
          </div>
        </>
      )}
      <small className={s.illustration}>
        Ilustrasi editorial · bukan tampilan produk
      </small>
    </div>
  );
}

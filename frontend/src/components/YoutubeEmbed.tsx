
import PropTypes from "prop-types";

function YoutubeEmbed(props: { embedId: string }) {
  const {embedId} = props
  return (
    <div className="video-responsive">
      <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
    </div>
  )
}
YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed
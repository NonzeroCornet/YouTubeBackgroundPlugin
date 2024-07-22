/**
 * @name YouTubeBackground
 * @author Brian Dean Ullery
 * @description Live YouTube background
 * @version 0.0.1
 */

module.exports = class Wallpaper {
  constructor() {
    this.defaultSettings = {
      videoId: "Doy42qiJtc8",
    };
  }

  getName() {
    return "YouTubeBackground";
  }

  getDescription() {
    return "Live YouTube background";
  }

  getVersion() {
    return "0.0.1";
  }

  start() {
    this.loadSettings();
    if (!document.getElementById("background-video")) {
      const iframe = document.createElement("iframe");
      iframe.id = "background-video";
      const id = this.settings.videoId;
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0&mute=1&showinfo=0&modestbranding=1`;
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.objectFit = "cover";
      iframe.style.zIndex = "-1";
      document.body.appendChild(iframe);
    }
    if (!document.getElementById("background-video-stylesheet")) {
      const style = document.createElement("style");
      style.id = "background-video-stylesheet";
      style.type = "text/css";
      const css = `
          @media (min-aspect-ratio: 16/9) {
              #background-video {
                  height: 56.25vw !important;
                  width: 100vw !important;
                  object-fit: cover !important;
              }
          }
          
          @media (max-aspect-ratio: 16/9) {
              #background-video {
                  width: 177.78vh !important;
                  height: 100vh !important;
                  object-fit: cover !important;
              }
          }
      `;
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }
  }

  stop() {
    if (document.getElementById("background-video")) {
      document.getElementById("background-video").remove();
    }
    if (document.getElementById("background-video-stylesheet")) {
      document.getElementById("background-video-stylesheet").remove();
    }
  }

  loadSettings() {
    this.settings = Object.assign(
      {},
      this.defaultSettings,
      BdApi.loadData(this.getName(), "settings")
    );
  }

  saveSettings() {
    BdApi.saveData(this.getName(), "settings", this.settings);
  }

  addSettingsPanel() {
    const { React } = BdApi;
    const { TextInput, FormItem } = BdApi.findModuleByProps(
      "TextInput",
      "FormItem"
    );

    class SettingsPanel extends React.Component {
      constructor(props) {
        super(props);
        this.state = { videoId: props.plugin.settings.videoId };
      }

      handleChange = (e) => {
        this.setState({ videoId: e.target.value });
      };

      save = () => {
        this.props.plugin.settings.videoId = this.state.videoId;
        this.props.plugin.saveSettings();
      };

      render() {
        return React.createElement(
          "div",
          null,
          React.createElement(
            FormItem,
            { title: "YouTube Video ID" },
            React.createElement(TextInput, {
              value: this.state.videoId,
              onChange: this.handleChange,
            })
          ),
          React.createElement("button", { onClick: this.save }, "Save")
        );
      }
    }

    BdApi.showSettingsPanel(SettingsPanel, this);
  }
};

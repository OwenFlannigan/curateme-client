import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

class TagInput extends React.Component {
    constructor(props) {
        super(props);

        if(this.props.tags) {
            var existingTags = this.props.tags.map((tag, index) => {
                return {
                    id: index,
                    text: tag
                };
            });
        }

        this.state = {
            tags: existingTags ? existingTags : [],
            suggestions: this.props.suggestions
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    handleDelete(i) {
        var tags = this.state.tags.filter((tag, index) => index !== i)
        this.setState({
            tags: tags
        });
        this.props.onNewTag(tags);
    }

    handleAddition(tag) {
        var tags = [
            ...this.state.tags,
            {
                id: this.state.tags.length + 1,
                text: tag
            }
        ];
        this.setState({ tags: tags });
        this.props.onNewTag(tags);
    }


    render() {
        const { tags, suggestions } = this.state;
        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={this.props.suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    delimiters={[13, 188]}
                    minQueryLength={1}
                    maxLength="20"
                    placeholder={this.props.placeholder}
                    autocomplete={this.props.autocomplete ? true : false} />
            </div>
        )
    }
}

class MoodTagInput extends React.Component {
    render() {
        var moods = ['angry', 'anxious', 'apathetic', 'blissful', 'calm', 'chill', 'cheerful', 'complacent', 'content', 'discontent', 'ecstatic', 'empowered', 'energetic', 'enraged', 'enthralled', 'envious', 'excited', 'flirty', 'fresh', 'frustrated', 'good', 'guilty', 'happy', 'high', 'hopeful', 'indifferent', 'joyful', 'lazy', 'lonely', 'loving', 'mad', 'mellow', 'mournful', 'numb', 'optimistic', 'peaceful', 'relaxed', 'restless', 'sad', 'shocked', 'silly', 'smart', 'stressed', 'surprised', 'sympathetic', 'thankful', 'weird'];


        return(
            <TagInput
                onNewTag={this.props.onNewTag}
                placeholder="moods (this playlist makes me feel...)"
                suggestions={moods} />
        );
    }
}

export { MoodTagInput }
export default TagInput;
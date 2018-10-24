import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ScrollableContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = { left: 0, panel: 0 };
        this.onHover = this.onHover.bind(this);
        this.setSizeContainer = this.setSizeContainer.bind(this);
    }

    componentDidMount() {
        window.onresize = this.setSizeContainer;
        this.setSizeContainer();
    }

    setSizeContainer() {
        if (this.container) {
            var left = this.container.clientWidth * this.state.panel;
            this.setState({ containerHeight: Math.ceil(this.container.clientWidth * .33), left: -left });
        }
    }

    onHover(e) {
        var offset = this.childContent.getBoundingClientRect();

        if (offset.left == 14) {
            this.setState({ leftVisible: false });
        } else {
            this.setState({ leftVisible: true });
        }

        if (offset.right == this.container.clientWidth + 14) {
            this.setState({ rightVisible: true, loadMore: true });
        } else {
            this.setState({ rightVisible: true, loadMore: false });
        }
    }

    handleChevronClick(direction) {
        var left = 0;
        var panel = 1;

        this.onHover();
        if (direction == 'right') {
            if (this.state.loadMore) {
                this.props.onLoadMore();
                left = this.state.left - this.container.clientWidth;
                panel = this.state.panel + 1;
            } else {
                if (Math.abs(this.state.left - this.container.clientWidth) + this.container.clientWidth < this.childContent.clientWidth) {
                    left = this.state.left - this.container.clientWidth;
                    panel = this.state.panel + 1;
                } else {
                    left = -this.childContent.clientWidth + this.container.clientWidth;
                }
            }
            this.setState({ left: left, panel: panel });
        } else {
            if (this.state.left + this.container.clientWidth <= 0) {
                left = this.state.left + this.container.clientWidth;
                panel = this.state.panel - 1;
            }
            this.setState({ left: left, panel: panel });
        }
    }

    render() {
        let children = null;
        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                width: this.container.clientWidth
            });
        }

        return (
            <div className="scrollable-content-container"
                ref={(input) => { this.container = input }}
                style={{ height: this.state.containerHeight ? this.state.containerHeight : '400px' }}
                onMouseOver={this.onHover}
                onScroll={this.onHover}
                onMouseLeave={() => { this.setState({ rightVisible: false, leftVisible: false }) }}>

                {this.state.leftVisible &&
                    <div
                        onClick={() => { this.handleChevronClick('left') }}
                        className="chevron-container-left"
                        name="left-chevron"
                        onMouseOver={() => { this.setState({ leftSize: '8rem' }) }}
                        onMouseLeave={() => { this.setState({ leftSize: '7rem' }) }}>
                        <div className="chevron-left" style={{ backgroundSize: this.state.leftSize }}></div>
                    </div>}

                <div className="scrollable-content">
                    <div>
                        <div
                            style={{
                                position: 'absolute',
                                left: this.state.left,
                                top: '0'
                            }}
                            ref={(input) => { this.childContent = input }}
                            className="scrollable-content-children">

                            {children}
                        </div>
                    </div>
                </div>

                {this.state.rightVisible &&
                    <div
                        onClick={() => { this.handleChevronClick('right') }}
                        className="chevron-container-right"
                        name="right-chevron"
                        onMouseOver={() => { this.setState({ rightSize: '8rem' }) }}
                        onMouseLeave={() => { this.setState({ rightSize: '7rem' }) }}>
                        <div
                            className={this.state.loadMore ? 'chevron-right refresh' : 'chevron-right'}
                            style={{ backgroundSize: this.state.rightSize }}></div>
                    </div>}
            </div>
        );
    }
}

export default ScrollableContent;
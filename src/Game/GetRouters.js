import React, { Component } from 'react';
import {
    HashRouter,
    Routes,
    Route
} from "react-router-dom";
import Chess from './Chess';

export default class GetRouters extends Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/chess" element={<Chess />} />
                    <Route path="/" element={<Chess />} /> // 可将根路径也指向五子棋页面，按需调整
                    <Route path="*" element={<Chess />} /> // 添加默认重定向到五子棋页面，可根据实际情况决定是否保留
                </Routes>
            </HashRouter>
        );
    }
}